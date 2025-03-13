import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stack } from "@/components/Stack";
import Image from "next/image";

export default function Home() {
  return (
   <>
      <Navbar />
      <Hero />
      <Stack />
   </>
  );
}
