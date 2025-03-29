import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PopupAlert from "@/components/PopupAlert";

export const metadata: Metadata = {
  title: "Love In Action - Charity & Nonprofit HTML5 Template",
  description: "Love In Action – is a clean, modern and responsive design that let you to build an exclusive website for charity, charity foundation, crowdfunding, donate, donation, foundation, fundraiser, fundraising, fundraising campaign.",
  keywords: "charity, nonprofit, donation, volunteer, fundraising, community, foundation",
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
          href="/fonts/Specify-ExpandedBold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Specify-ExpandedMedium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientBody>
          <PopupAlert />
          <Header />
          <main className="min-h-screen pt-16 container">
            {children}
          </main>
          <Footer />
        </ClientBody>
      </body>
    </html>
  );
}
