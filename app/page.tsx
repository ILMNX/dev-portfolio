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
import type { Metadata } from 'next';
import { generateMetadata, siteConfig } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description: `Welcome to ${siteConfig.name}'s portfolio. Discover innovative web applications, mobile solutions, and software projects built with cutting-edge technologies like React, Next.js, Node.js, and more. Available for freelance projects and full-time opportunities.`,
  url: siteConfig.url,
});

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
    <Contact/>
    <Analytics />
    <SpeedInsights/>
    <Footer/>
  </>
  );
}
