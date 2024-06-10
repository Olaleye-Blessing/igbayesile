import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import "@ui/globals.css";
import "./material-icons.css";
import Providers from "@website/components/providers";
import { Toaster } from "react-hot-toast";
import InitializeConfigs from "@website/components/initialize-configs";
import Navbar from "@website/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Igbayesile",
  description:
    "A hotel reservation platform that simplifies booking for guests, managers, and staff.",
  applicationName: "Igbayesile",
  keywords: ["hotel", "reservation", "manager", "guest", "staff"],
  authors: [
    { name: "Olaleye Blessing" },
    { name: "Olaleye Blessing", url: "https://www.blessingolaleye.xyz/" },
  ],
  creator: "Olaleye Blessing",
  publisher: "Olaleye Blessing",
  manifest: "https://www.igbayesile.xyz/manifest.json",
  openGraph: {
    title: "Igbayesile",
    description:
      "A hotel reservation platform that simplifies booking for guests, managers, and staff.",
    url: "https://www.igbayesile.xyz/site.webmanifest",
    siteName: "Igbayesile",
    images: [
      // {
      //   url: "https://nextjs.org/og.png", // Must be an absolute URL
      //   width: 800,
      //   height: 600,
      // },
      // {
      //   url: "https://nextjs.org/og-alt.png", // Must be an absolute URL
      //   width: 1800,
      //   height: 1600,
      //   alt: "My custom alt",
      // },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    // googleBot: {
    //   index: true,
    //   follow: false,
    //   noimageindex: true,
    //   "max-video-preview": -1,
    //   "max-image-preview": "large",
    //   "max-snippet": -1,
    // },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* {process.env.NODE_ENV !== "production" ? (
          <Providers>
            <InitializeConfigs>
              <Navbar />
              {children}
            </InitializeConfigs>
            <Toaster />
          </Providers>
        ) : (
          <main className="flex items-center justify-center h-screen">
            <h1>COMING SOON</h1>
          </main>
        )} */}
        <Providers>
          <InitializeConfigs>
            <Navbar />
            {children}
          </InitializeConfigs>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
