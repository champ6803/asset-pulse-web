import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Asset Pulse | SCBX Group Asset Management",
  description: "AI-powered Software Asset Management platform for SCBX Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          defer
        ></script>
      </head>
      <body className="bg-gray-50 antialiased">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
