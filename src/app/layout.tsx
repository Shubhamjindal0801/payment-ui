import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./layout.css";
import { AssetUrls } from "@/common/AssetUrls";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Len Den - One stop solution for all your money management problems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        />
        <link rel="icon" href={AssetUrls.APP_LOGO} />
      </head>
      <body className={inter.className}>
        {children}
        <script src="path/to/globals.js"></script>
      </body>
    </html>
  );
}
