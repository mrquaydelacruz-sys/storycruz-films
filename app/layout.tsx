import type { Metadata } from "next";
import { Playfair_Display, Lato, Alex_Brush } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { client, urlFor } from "@/sanity/client";
import { WelcomePopup } from "@/components/WelcomePopup";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({ 
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cursive = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryCruz Films",
  description: "High-end wedding photography and videography",
};

// 2. Updated fetch function to get Logo AND Popup data
async function getData() {
  return await client.fetch(`*[_type == "siteContent"][0]{ 
    navbarLogo,
    // Popup Fields
    popupActive,
    popupImage,
    popupTitle,
    popupText,
    popupLink,
    popupLinkText
  }`);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getData();

  // Extract the logo URL specifically for the Navbar
  const logoUrl = data?.navbarLogo ? urlFor(data.navbarLogo).url() : undefined;

  return (
    <html lang="en">
      {/* Kept your existing body classes (bg-transparent, fonts, etc.) */}
      <body className={`${playfair.variable} ${lato.variable} ${cursive.variable} antialiased bg-transparent text-offwhite min-h-screen flex flex-col`}>

        {/* Custom Cursor */}
        <CustomCursor />

        {/* 3. The Welcome Popup sits here (it will handle its own display logic) */}
        <WelcomePopup data={data} />

        <Navbar logoUrl={logoUrl} />

        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}