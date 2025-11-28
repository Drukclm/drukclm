"use client";

import { useThemeStore } from "../../store/themeStore";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Network = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

const networks: Network[] = [
  {
    id: "pride",
    name: "Pride Bhutan",
    logo: "/assets/pride.png",
    href: "/support-request?network=pride_bhutan",
  },
  {
    id: "lhaksam",
    name: "Lhak-Sam",
    logo: "/assets/Lhak-Sam_Logo_PNG-removebg-preview.png",
    href: "/support-request?network=lhak_sam",
  },
  {
    id: "cpa",
    name: "Chithuen Phendhey",
    logo: "/assets/CPA_logo-removebg-preview.png",
    href: "/support-request?network=chithuen_phendhey",
  },
  {
    id: "rpn",
    name: "Red Purse Network",
    logo: "/assets/red-purse-network-logo.png",
    href: "/support-request?network=red_purse_network",
  },
  {
    id: "others",
    name: "Others",
    logo: "/assets/logo copy.png",
    href: "/support-request?network=others",
  },
];


const NetworkCard: React.FC<{ network: Network; isDarkMode: boolean }> = ({
  network,
  isDarkMode,
}) => (
  <div
    className={`group rounded-xl border shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
      isDarkMode
        ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-400/30 hover:shadow-cyan-500/10"
        : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 hover:shadow-orange-500/10"
    }`}
  >
    <div className="p-6 flex flex-col h-full">
      <div className="w-full h-24 mb-4 flex items-center justify-center">
        <Image
          src={network.logo}
          alt={`${network.name} Logo`}
          width={96}
          height={96}
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h5
        className={`text-xl font-semibold mb-4 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {network.name}
      </h5>
      <div className="mt-auto">
        <Link
          href={network.href}
          className={`block w-full text-white py-2 px-4 rounded-full transition-all duration-300 text-center shadow-md ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/30"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-orange-500/30"
          }`}
        >
          Select
        </Link>
      </div>
    </div>
  </div>
);

const NetworkSelection = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <Head>
        <title>Network Selection | Druk CLM</title>
        <meta
          name="description"
          content="Select your network for support request submission"
        />
      </Head>

      <div
        className={`font-poppins min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-amber-50 text-gray-800"
        }`}
      >
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4 max-w-6xl">
            {/* Hero Section */}
            <div
              className={`py-12 px-8 mb-12 relative overflow-hidden rounded-xl ${
                isDarkMode
                  ? "bg-gray-900 via-indigo-900 to-purple-900"
                  : "bg-amber-100 via-orange-100 to-pink-100"
              }`}
            >
              <div className="text-center max-w-4xl mx-auto relative z-10">
                <h1
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight`}
                >
                  Which network do you belong to?
                </h1>
                <p className="text-lg md:text-xl leading-relaxed">
                  Select your organization to submit a support request.
                </p>
              </div>
            </div>

            {/* Network Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {networks.map((network) => (
                <NetworkCard
                  key={network.id}
                  network={network}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default NetworkSelection;
