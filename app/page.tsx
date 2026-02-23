import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";

export default function Home() {
  return (
    <div className="font-montserrat min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content – padding so it starts below fixed navbar */}
      <main className="relative pt-[var(--nav-total-top)] min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* background tailwind trick  */}
        <div className="pointer-events-none absolute -top-40 -left-30 -z-10 h-[500px] w-[500px] rounded-full bg-purple-400/30 blur-[120px]"></div>
        <div className="pointer-events-none absolute top-20 right-[-200px] -z-10 h-[500px] w-[500px] rounded-full bg-pink-400/20 blur-[120px]"></div>
        <div className="pointer-events-none absolute bottom-[200px] left-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-green-400/20 blur-[120px]"></div>
        <div className="pointer-events-none absolute top-[200px] left-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-orange-400/20 blur-[120px]"></div>
      </main>
    </div>
  );
}
