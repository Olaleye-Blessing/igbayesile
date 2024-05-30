import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import "@repo/ui/globals.css";
import "./material-icons.css";
import Providers from "@website/components/providers";
import { Toaster } from "react-hot-toast";
import InitializeConfigs from "@website/components/initialize-configs";
import Navbar from "@website/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
