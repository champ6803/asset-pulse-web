import type { Metadata } from "next";
import "./globals.css";

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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer" defer></script>
      </head>
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}

