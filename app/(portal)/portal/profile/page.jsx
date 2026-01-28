import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getVolunteerProfile(userId) {
    return await prisma.volunteer.findUnique({
        where: { userId },
    });
}

export default async function ProfilePage() {
    const session = await auth();
    const volunteer = await getVolunteerProfile(session.user.id);

    if (!volunteer) {
        return (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>
                <p className="text-gray-500 mt-2">Contact admin for assistance.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">View your volunteer information</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <p className="text-gray-900">{volunteer.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <p className="text-gray-900">{volunteer.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <p className="text-gray-900">{volunteer.phone}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${volunteer.status === "approved" ? "bg-green-100 text-green-700" :
                                volunteer.status === "pending" ? "bg-orange-100 text-orange-700" :
                                    "bg-red-100 text-red-700"
                            }`}>
                            {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                    </div>

                    {volunteer.skills && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                            <p className="text-gray-900">{volunteer.skills}</p>
                        </div>
                    )}

                    {volunteer.availability && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                            <p className="text-gray-900">{volunteer.availability}</p>
                        </div>
                    )}

                    {volunteer.motivation && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Motivation</label>
                            <p className="text-gray-900">{volunteer.motivation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}