'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeStore } from '../../store/themeStore';

type Network = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

type ConsentPopupProps = {
  isVisible: boolean;
  onConsent: () => void;
  onDecline: () => void;
  isDarkMode: boolean;
};

type NetworkCardProps = {
  network: Network;
  isDarkMode: boolean;
};

const networks = [
  {
    id: 'pride',
    name: 'Pride Bhutan',
    logo: '/assets/pride.png',
    href: '/screening?network=pride_Bhutan'
  },
  {
    id: 'lhaksam',
    name: 'Lhak-Sam',
    logo: '/assets/Lhak-Sam_Logo_PNG-removebg-preview.png',
    href: '/screening?network=lhak_sam'
  },
  {
    id: 'cpa',
    name: 'Chithuen Phendhey',
    logo: '/assets/CPA_logo-removebg-preview.png',
    href: '/screening?network=chithuen_phendhey'
  },
  {
    id: 'rpn',
    name: 'Red Purse Network',
    logo: '/assets/red-purse-network-logo.png',
    href: '/screening?network=red_purse_network'
  },
  {
    id: 'others',
    name: 'Others',
    logo: '/assets/logo copy.png',
    href: '/screening?network=others'
  }
];

const NetworkCard: React.FC<NetworkCardProps> = ({ network, isDarkMode }) => {
  return (
    <div className={`group rounded-xl border shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
      isDarkMode
        ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-400/30 hover:shadow-cyan-500/10"
        : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 hover:shadow-orange-500/10"
    }`}>
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
        <h5 className={`text-xl font-semibold mb-4 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}>
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
};

const ConsentPopup: React.FC<ConsentPopupProps> = ({ isVisible, onConsent, onDecline, isDarkMode }) => {
  if (!isVisible) return null;

  const currentYear = new Date().getFullYear(); 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className={`p-8 rounded-xl border shadow-2xl max-w-md w-full relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200"
      }`}>
        <div className="absolute inset-0 opacity-10 mix-blend-overlay rounded-xl"></div>
        <div className="relative z-10">
          <h4 className={`text-2xl font-bold text-transparent bg-clip-text mb-4 text-center ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-400 to-blue-400"
              : "bg-gradient-to-r from-amber-600 to-orange-600"
          }`}>
            Do you consent to participate in CLM {currentYear}?
          </h4>
          <p className={`mb-6 text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Your participation helps improve healthcare services for communities in Bhutan.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConsent}
              className={`text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/30"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-orange-500/30"
              }`}
            >
              Yes
            </button>
            <button
              onClick={onDecline}
              className={`font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-gray-700/30"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-orange-200/30"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkSelection = () => {
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    setShowConsentPopup(true);
  }, []);

  const handleConsent = () => {
    setShowConsentPopup(false);
  };

  const handleDecline = () => {
    alert("Thank you! 😊");
    window.location.href = "/";
  };

  return (
    <>
      <Head>
        <title>Network Selection | Druk CLM</title>
        <meta name="description" content="Select your network for Community-led Monitoring" />
      </Head>

      <div className={`font-poppins min-h-screen ${
        isDarkMode 
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-amber-50 to-orange-50 text-gray-800"
      }`}>
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-4 max-w-6xl">
            {/* Hero Section */}
            <div className={`wave-container py-12 px-8 mb-12 relative overflow-hidden rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
                : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100"
            }`}>
              <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
              <div className="text-center max-w-4xl mx-auto relative z-10">
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 neon-glow"
                    : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 sun-glow"
                }`}>
                  Which network do you belong to?
                </h1>
                <p className={`text-lg md:text-xl leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Select your organization to begin the Community-led Monitoring process
                </p>
              </div>
              <div className="wave" style={{ height: "120px" }}></div>
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

        <ConsentPopup
          isVisible={showConsentPopup}
          onConsent={handleConsent}
          onDecline={handleDecline}
          isDarkMode={isDarkMode}
        />
      </div>
    </>
  );
};

export default NetworkSelection;
