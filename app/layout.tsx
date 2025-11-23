import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || "The Wedding Station";
const siteDescription =
  "Professional wedding photography and videography services. Capturing your special moments with elegance and artistry.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: ["wedding photography", "wedding videography", "photographer", "videographer"],
  authors: [{ name: siteTitle }],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

