import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { paiseToRupees } from "@/lib/utils/currency";
import {
  logActivity,
  AuditAction,
  EntityType,
} from "@/lib/services/audit.service";

export async function GET(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        campaigns: {
          select: {
            id: true,
            title: true,
            status: true,
            goalAmount: true,
            raisedAmount: true,
          },
        },
        donations: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            campaign: { select: { title: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        campaigns: user.campaigns.map((c) => ({
          ...c,
          goalAmount: paiseToRupees(c.goalAmount),
          raisedAmount: paiseToRupees(c.raisedAmount),
        })),
        donations: user.donations.map((d) => ({
          ...d,
          amount: paiseToRupees(d.amount),
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const data = await req.json();

    const updateData = {};
    if (data.role !== undefined) {
      if (!["USER", "ADMIN", "VOLUNTEER"].includes(data.role)) {
        return NextResponse.json(
          { success: false, message: "Invalid role" },
          { status: 400 },
        );
      }
      updateData.role = data.role;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    if (data.role && data.role !== existingUser.role) {
      logActivity({
        userId: session.user.id,
        action: AuditAction.USER_ROLE_CHANGED,
        entityType: EntityType.USER,
        entityId: id,
        details: {
          targetEmail: existingUser.email,
          oldRole: existingUser.role,
          newRole: data.role,
        },
        req,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true, role: true },
    });

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    await prisma.user.delete({ where: { id } });

    logActivity({
      userId: session.user.id,
      action: AuditAction.USER_DELETED,
      entityType: EntityType.USER,
      entityId: id,
      details: {
        deletedEmail: userToDelete.email,
        deletedName: userToDelete.name,
        deletedRole: userToDelete.role,
      },
      req,
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 },
    );
  }
}
