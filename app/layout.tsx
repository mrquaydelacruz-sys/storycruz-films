// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Lato, Alex_Brush } from "next/font/google"; 
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. Import your new Footer
import { client, urlFor } from "@/sanity/client";

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

async function getLogo() {
  const data = await client.fetch(`*[_type == "siteContent"][0]{ navbarLogo }`);
  if (data?.navbarLogo) {
    return urlFor(data.navbarLogo).url();
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getLogo();

  return (
    <html lang="en">
      {/* 2. Added bg-transparent to the body so the WebGL background can show through */}
      <body className={`${playfair.variable} ${lato.variable} ${cursive.variable} antialiased bg-transparent text-offwhite min-h-screen flex flex-col`}>
        <Navbar logoUrl={logoUrl || undefined} /> 
        
        {/* 3. Main content area */}
        <div className="flex-grow">
          {children}
        </div>

        {/* 4. Global Footer */}
        <Footer />
      </body>
    </html>
  );
}