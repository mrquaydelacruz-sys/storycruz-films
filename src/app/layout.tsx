import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSiteChromeData } from "@/lib/site-chrome";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const sans = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryCruz Films",
  description: "Wedding Films & Photography",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chrome = await getSiteChromeData();

  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${sans.variable} antialiased`}
      >
        <SiteChrome chrome={chrome}>{children}</SiteChrome>
      </body>
    </html>
  );
}
