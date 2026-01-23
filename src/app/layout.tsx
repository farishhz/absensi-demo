import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiHebat8 - Sistem Absensi Digital SMKN 8 Jakarta",
  description: "Sistem absensi online berbasis web untuk SMKN 8 Jakarta. Hadir Tepat, Data Akurat, Sekolah Hebat.",
  keywords: ["SiHebat8", "SMKN 8 Jakarta", "Absensi Digital", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React"],
  authors: [{ name: "SiHebat8 Team" }],
  icons: {
    icon: "📚",
  },
  openGraph: {
    title: "SiHebat8 - Sistem Absensi Digital SMKN 8 Jakarta",
    description: "Sistem absensi online berbasis web untuk SMKN 8 Jakarta. Hadir Tepat, Data Akurat, Sekolah Hebat.",
    url: "https://sihebat8.vercel.app",
    siteName: "SiHebat8",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiHebat8 - Sistem Absensi Digital SMKN 8 Jakarta",
    description: "Sistem absensi online berbasis web untuk SMKN 8 Jakarta. Hadir Tepat, Data Akurat, Sekolah Hebat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
