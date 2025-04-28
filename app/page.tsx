import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stack } from "@/components/Stack";
import { LogoAnimation } from "@/components/LogoAnimation";
import { Portfolio } from "@/components/Portfolio";
import { KeyMetrics } from "@/components/KeyMetrics";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights} from '@vercel/speed-insights/next';

export default function Home() {
  return (
   <>
      <Analytics />
      <SpeedInsights/>
      <Navbar />
      <Hero />
      <Stack />
      <LogoAnimation/>
      <Portfolio/>
      <KeyMetrics/>
      <Services/>
      <Contact/>
      <Footer/>
   </>
  );
}
