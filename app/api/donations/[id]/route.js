import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { paiseToRupees } from "@/lib/utils/currency";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            category: true,
            organizerName: true,
          },
        },
      },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      donation: {
        ...donation,
        amount: paiseToRupees(donation.amount),
      },
    });
  } catch (error) {
    console.error("Get donation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch donation" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const donation = await prisma.donation.findUnique({
      where: { id },
      select: { id: true, paymentStatus: true, amount: true, campaignId: true },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 },
      );
    }

    if (donation.paymentStatus === "completed") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete completed donations. Financial records must be preserved.",
        },
        { status: 400 },
      );
    }

    await prisma.donation.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Donation record deleted",
    });
  } catch (error) {
    console.error("Delete donation error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to delete donation" },
      { status: 500 },
    );
  }
}
