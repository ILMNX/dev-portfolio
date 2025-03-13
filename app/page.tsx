import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stack } from "@/components/Stack";
import { LogoAnimation } from "@/components/LogoAnimation";

import Image from "next/image";
import { Portfolio } from "@/components/Portfolio";
import { KeyMetrics } from "@/components/KeyMetrics";
import { Services } from "@/components/Services";

export default function Home() {
  return (
   <>
      <Navbar />
      <Hero />
      <Stack />
      <LogoAnimation/>
      <Portfolio/>
      <KeyMetrics/>
      <Services/>

   </>
  );
}
