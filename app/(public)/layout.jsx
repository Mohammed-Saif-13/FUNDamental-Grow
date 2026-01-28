import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";

export default async function PublicLayout({ children }) {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-16 md:pt-20">{children}</main>
                <Footer />
            </div>
        </SessionProvider>
    );
}