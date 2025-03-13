import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stack } from "@/components/Stack";
import { LogoAnimation } from "@/components/LogoAnimation";

import Image from "next/image";

export default function Home() {
  return (
   <>
      <Navbar />
      <Hero />
      <Stack />
      <LogoAnimation/>

   </>
  );
}
