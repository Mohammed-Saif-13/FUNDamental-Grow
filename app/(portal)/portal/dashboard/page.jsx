import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock, AlertCircle, Target } from "lucide-react";

async function getVolunteerStats(userId) {
    const volunteer = await prisma.volunteer.findUnique({
        where: { userId },
        include: {
            tasks: {
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
    });

    if (!volunteer) return null;

    const allTasks = await prisma.volunteerTask.findMany({
        where: { volunteerId: volunteer.id },
    });

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === "completed").length;
    const pendingTasks = allTasks.filter(t => t.status === "pending").length;
    const inProgressTasks = allTasks.filter(t => t.status === "in_progress").length;

    return {
        volunteer,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        recentTasks: volunteer.tasks,
    };
}

export default async function VolunteerDashboard() {
    const session = await auth();
    const stats = await getVolunteerStats(session.user.id);

    if (!stats) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-900">Volunteer Profile Not Found</h1>
                <p className="text-gray-500 mt-2">Please contact admin.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your activity summary.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Completed</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedTasks}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">In Progress</p>
                            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.inProgressTasks}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-xl">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Pending</p>
                            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.pendingTasks}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <AlertCircle className="h-6 w-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>

                {stats.recentTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks assigned yet.</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recentTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{task.description.substring(0, 80)}...</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${task.status === "completed" ? "bg-green-100 text-green-700" :
                                        task.status === "in_progress" ? "bg-orange-100 text-orange-700" :
                                            "bg-gray-100 text-gray-700"
                                    }`}>
                                    {task.status === "completed" ? "Completed" :
                                        task.status === "in_progress" ? "In Progress" :
                                            "Pending"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}