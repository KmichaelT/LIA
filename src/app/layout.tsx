import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PopupAlert from "@/components/PopupAlert";
import GlobalRedirectLoader from "@/components/GlobalRedirectLoader"; 

export const metadata: Metadata = {
  title: "Love In Action – Sponsor a Child & Donate to Charity Online",
  description:
    "Love In Action is a responsive, modern charity foundation empowering you to sponsor children, support fundraising campaigns, and make a tangible difference. Explore our causes, join events, and donate securely online.",
  keywords: [
    "child sponsorship",
    "charity foundation",
    "donate online",
    "nonprofit events",
    "fundraising campaigns",
    "volunteer opportunities",
    "community support",
  ],
  authors: [{ name: "Love In Action", url: "https://www.loveinaction.co" }],
  openGraph: {
    title: "Love In Action – Sponsor a Child & Donate to Charity Online",
    description:
      "Empower children in need through sponsorship, fundraising, and community events. Join Love In Action today and change lives.",
    url: "https://www.loveinaction.co",
    siteName: "Love In Action",
    images: [
      {
        url: "https://www.loveinaction.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Happy sponsored child, Love In Action",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love In Action – Sponsor a Child & Donate to Charity Online",
    description:
      "Join Love In Action to sponsor children, back fundraising campaigns, and attend community events. Your support changes lives!",
    images: ["https://www.loveinaction.co/twitter-card.jpg"],
    creator: "@LoveInActionOrg",
  },
  robots: {
    index: true,
    follow: true,
    "googleBot": {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Specify-NormalMedium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <script src="https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js" async></script>
      </head>
      <body>
        <ClientBody>
          <GlobalRedirectLoader />
          <PopupAlert />
          <Header />
          <main className="min-h-screen pt-16 container">{children}</main>
          <Footer />
        </ClientBody>
 
      </body>
    </html>
  );
}