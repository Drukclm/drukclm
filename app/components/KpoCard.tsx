'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useThemeStore } from '../store/themeStore';

interface KpoCardProps {
  kpo: {
    logo: string;
    name: string;
    description: string;
    link: string;
  };
}

export default function KpoCard({ kpo }: KpoCardProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group border-2 shadow-lg sunset-card-hover ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-cyan-400/30' 
        : 'bg-amber-100 border-orange-200 hover:border-orange-400'
    }`}>
      <div className={`relative h-48 overflow-hidden flex items-center justify-center p-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-orange-100 to-red-100'
      }`}>
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
            : 'bg-gradient-to-br from-orange-400/20 to-red-400/20'
        }`}></div>
        <div className="absolute inset-0 opacity-10"></div>
        <Image 
          src={kpo.logo} 
          alt={`${kpo.name} Logo`} 
          width={300}
          height={200}
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
        />
      </div>
      <div className={`p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-800 to-gray-800' 
          : 'bg-gradient-to-b from-orange-50 to-red-50'
      }`}>
        <h3 className={`text-xl font-bold bg-clip-text text-transparent mb-3 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
            : 'bg-gradient-to-r from-orange-600 to-red-600'
        }`}>
          {kpo.name}
        </h3>
        <p className={`mb-6 leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-orange-900/90'
        }`}>
          {kpo.description}
        </p>
        <Link 
          href={kpo.link} 
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/20' 
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/30'
          }`}
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}