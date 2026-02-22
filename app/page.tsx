import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";

export default function Home() {
  return (
    <div className="font-montserrat min-h-screen pt-[var(--nav-height)]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* background tailwind trick  */}
      <div className="absolute -top-40 -left-30 h-[500px] w-[500px] bg-purple-400/30 blur-[120px]  rounded-full"></div>
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] bg-blue-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] bg-green-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] bg-orange-400/20 blur-[120px] rounded-full"></div>
    </div>
  );
}
