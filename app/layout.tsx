import type { Metadata } from "next";
import {Poppins} from "next/font/google"
import "./globals.css";
import Image from "next/image";

const poppins = Poppins({subsets: ["latin"],weight:["100", "200", "300", "400", "700", "800", "900"] }); 


export const metadata: Metadata = {
  title: "Gilbert Dev Portfolio",
  description: "Powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
