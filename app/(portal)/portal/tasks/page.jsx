import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getVolunteerTasks(userId) {
    const volunteer = await prisma.volunteer.findUnique({
        where: { userId },
        include: {
            tasks: {
                include: {
                    campaign: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    return volunteer?.tasks || [];
}

export default async function TasksPage() {
    const session = await auth();
    const tasks = await getVolunteerTasks(session.user.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-gray-500 mt-1">Manage your assigned volunteer tasks</p>
                </div>
                <div className="text-sm text-gray-500">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <p className="text-gray-500">No tasks assigned yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${task.priority === "high" ? "bg-red-100 text-red-700" :
                                                task.priority === "medium" ? "bg-orange-100 text-orange-700" :
                                                    "bg-blue-100 text-blue-700"
                                            }`}>
                                            {task.priority.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-3">{task.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {task.campaign && (
                                            <Link href={`/campaigns/${task.campaign.slug}`} className="text-purple-600 hover:underline">
                                                Campaign: {task.campaign.title}
                                            </Link>
                                        )}
                                        {task.dueDate && (
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-IN')}</span>
                                        )}
                                    </div>
                                </div>

                                <span className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${task.status === "completed" ? "bg-green-100 text-green-700" :
                                        task.status === "in_progress" ? "bg-orange-100 text-orange-700" :
                                            "bg-gray-100 text-gray-700"
                                    }`}>
                                    {task.status === "completed" ? "Completed" :
                                        task.status === "in_progress" ? "In Progress" :
                                            "Pending"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}