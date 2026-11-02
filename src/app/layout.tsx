import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSiteChromeData } from "@/lib/site-chrome";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://www.storycruzfilms.com";
const siteDescription =
  "StoryCruz Films creates cinematic wedding films and photography that capture the unscripted moments of your day.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StoryCruz Films | Wedding Films & Photography",
    template: "%s | StoryCruz Films",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "StoryCruz Films",
    title: "StoryCruz Films | Wedding Films & Photography",
    description: siteDescription,
    url: siteUrl,
    images: [{ url: "/logo.png", alt: "StoryCruz Films" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryCruz Films | Wedding Films & Photography",
    description: siteDescription,
    images: ["/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "StoryCruz Films",
  url: siteUrl,
  description: siteDescription,
  image: `${siteUrl}/logo.png`,
  sameAs: [
    "https://www.facebook.com/storycruzfilms",
    "https://www.instagram.com/storycruzfilms/",
    "https://www.youtube.com/@storycruzfilms",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome chrome={chrome}>{children}</SiteChrome>
      </body>
    </html>
  );
}
