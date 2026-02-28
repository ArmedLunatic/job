import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-tweet/theme.css";
import PayrollStrip from "@/components/job/PayrollStrip";
import { ToastProvider } from "@/components/ui/Toast";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "$JOB — AI Took Your Job. We're Hiring.",
  description:
    "AI took your job. Good news: $JOB is hiring. Hold $JOB, get paid hourly from creator fee payroll. No resume, no boss, no office.",
  openGraph: {
    title: "$JOB — AI Took Your Job. We're Hiring.",
    description:
      "Hold $JOB, earn hourly. Generate your Job Alert Card and Badge PFP. Clock in now.",
    type: "website",
    images: [{ url: "/job/job-icon.png", width: 512, height: 512, alt: "$JOB" }],
  },
  twitter: {
    card: "summary",
    title: "$JOB — AI Took Your Job. We're Hiring.",
    description:
      "Hold $JOB, earn hourly. Generate your Job Alert Card and Badge PFP. Clock in now.",
    images: ["/job/job-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
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
