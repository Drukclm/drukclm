'use client';

import KpoCard from "../components/KpoCard";
import Link from "next/link";
import { useThemeStore } from "../store/themeStore";

const kpoData = [
  {
    logo: "/assets/Lhak-Sam_Logo_PNG-removebg-preview.png",
    name: "Lhak-Sam",
    description:
      "Bhutan's Network of People Living with HIV and AIDS, dedicated to support and advocacy.",
    link: "https://www.lhaksam.org.bt/",
  },
  {
    logo: "/assets/pride.png",
    name: "Pride Bhutan",
    description:
      "Championing LGBTQ+ rights and fostering inclusivity in Bhutanese society.",
    link: "https://www.pridebhutan.com/",
  },
  {
    logo: "/assets/CPA_logo-removebg-preview.png",
    name: "Chithuen Phendhey Association",
    description:
      "Combating addiction and promoting holistic well-being in Bhutan.",
    link: "https://cpabhutan.org/",
  },
  {
    logo: "/assets/red-purse-network-logo.png",
    name: "The Red Purse Network",
    description:
      "Empowering and supporting sex workers in Bhutan through collective action.",
    link: "https://www.facebook.com/theredpursenetwork",
  },
];

export default function Home() {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      {/* Hero Section */}
      <section
        className={`hero wave-container pt-24 pb-32 relative overflow-hidden transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white"
            : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 text-gray-800"
        }`}
      >
        <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 max-w-6xl text-center relative z-10 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span
                className={`bg-clip-text text-transparent sun-pulse ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 neon-glow"
                    : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
                }`}
              >
                Empowering Communities Through Monitoring
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-2xl mx-auto mb-8 leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Join us in our mission to create positive change and build
              stronger, more resilient communities through data-driven insights
              and collaborative action.
            </p>
            <Link
              href="/screening-cpo"
              className={`inline-block font-bold py-4 px-10 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 sun-pulse ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30"
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="wave"></div>
      </section>

      {/* KPOs Section */}
      <section
        className={`kpos py-20 transition-all duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-orange-50"
        }`}
      >
        <div
          className="container mx-auto px-4 max-w-6xl animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent mb-6 ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 to-blue-400 neon-glow"
                  : "bg-gradient-to-r from-orange-600 to-red-600 sun-glow"
              }`}
            >
              Our Key Partner Organizations
            </h2>
            <div
              className={`w-32 h-2 mx-auto rounded-full mb-8 sun-pulse ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-gradient-to-r from-orange-600 to-red-600"
              }`}
            ></div>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-orange-800/80"
              }`}
            >
              Collaborating with leading organizations to drive meaningful
              change in our communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {kpoData.map((kpo, index) => (
              <KpoCard key={index} kpo={kpo} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
