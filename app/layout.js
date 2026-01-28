import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/SessionProvider";
import SmoothScrolling from "@/components/SmoothScrolling";
import { validateEnv } from "@/lib/env";
import "./globals.css";

// Validate environment variables on server startup
if (typeof window === "undefined") {
  validateEnv();
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "FUNDamental Grow - Crowdfunding Platform",
  description: "Empowering communities through transparent crowdfunding",
  keywords: [
    "crowdfunding",
    "fundraising",
    "donate",
    "charity",
    "NGO",
    "India",
  ],
  authors: [{ name: "FUNDamental Grow Team" }],
  openGraph: {
    title: "FUNDamental Grow - Crowdfunding Platform",
    description: "Empowering communities through transparent crowdfunding",
    type: "website",
    locale: "en_IN",
    siteName: "FUNDamental Grow",
  },
  twitter: {
    card: "summary_large_image",
    title: "FUNDamental Grow - Crowdfunding Platform",
    description: "Empowering communities through transparent crowdfunding",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <SmoothScrolling>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#fff",
                  color: "#1f2937",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                },
                success: {
                  iconTheme: { primary: "#22c55e", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
