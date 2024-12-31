import { AIAssistant } from "@/components/core/ai-assistant";
import Image from "next/image";
import { playfair, poppins } from "./fonts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F4E9] to-white">
      {/* Header with Centered Logo and Text */}
      <header
        className="w-full bg-cover bg-center relative flex flex-col items-center justify-center text-center py-16"
        style={{ backgroundImage: "url('/carpet-bg.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <Image
            src="/logo.svg"
            alt="SGoAI Logo"
            width={120}
            height={120}
            className="mb-8 drop-shadow-xl"
            priority
          />
          {/* Title */}
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight`}
          >
          
            <span
              className={`${poppins.className} font-medium text-white/90 ml-3`}
            >
              
            </span>
          </h1>
          {/* Subtitle */}
          <p
            className={`${poppins.className} text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-wide`}
          >
           
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <AIAssistant />
      </main>

      {/* Footer */}
      <footer className="w-full bg-cover bg-center relative py-6">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url('/carpet-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-sm text-white text-center">
            © {new Date().getFullYear()} SGoAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
