import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PayrollStrip from "@/components/job/PayrollStrip";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$JOB — AI Took Your Job. We're Hiring.",
  description:
    "AI took your job. Good news: $JOB is hiring. Hold $JOB, get paid hourly from creator fee payroll. No resume, no boss, no office.",
  openGraph: {
    title: "$JOB — AI Took Your Job. We're Hiring.",
    description:
      "Hold $JOB, earn hourly. Generate your Job Alert Card and Badge PFP. Clock in now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        <ToastProvider>
          <PayrollStrip />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
