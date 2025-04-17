import type { Metadata } from "next";
import {Poppins} from "next/font/google"
import "./globals.css";
import Preloader from "../components/Preloader";

const poppins = Poppins({subsets: ["latin"],weight:["100", "200", "300", "400", "700", "800", "900"] }); 

export const metadata = {
  title: "Gilbert Dev Portfolio",
  description: "Powered by Next.js",
} satisfies Metadata;

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
        <Preloader />
        {children}
      </body>
    </html>
  );
}
