"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useThemeStore } from "../../store/themeStore";

const AboutPage = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <Head>
        <title>About Druk CLM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <section
            className={`wave-container py-16 px-8 mb-12 relative overflow-hidden rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white"
                : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 text-gray-800"
            }`}
          >
            <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
            <div className="text-center max-w-4xl mx-auto relative z-10">
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 neon-glow"
                    : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 sun-glow"
                }`}
              >
                Empowering Communities for Sustainable Health Equity
              </h1>
              <p
                className={`text-lg md:text-xl leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Join us in reshaping healthcare in Bhutan through innovation and
                collaboration.
              </p>
            </div>
            <div className="wave" style={{ height: "120px" }}></div>
          </section>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Our Story Section */}
            <section
              className={`p-8 rounded-xl border shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-400/30 text-gray-300"
                  : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 text-gray-700"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 neon-glow"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 sun-glow"
                }`}
              >
                Our Story
              </h2>
              <div className="prose max-w-none">
                <p className="mb-6 leading-relaxed">
                  The Sustainability of HIV Services for Key Populations in
                  South-East Asia (SKPA)-2 program, funded by the esteemed
                  Global Fund to Fight AIDS, Tuberculosis and Malaria,
                  represents our collective endeavor to elevate the standards of
                  healthcare provision.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div
                    className={`p-6 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-800"
                        : "bg-orange-50/80 border-orange-200"
                    }`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? "text-cyan-400" : "text-amber-600"
                      }`}
                    >
                      Our Mission
                    </h3>
                    <p>
                      Working tirelessly alongside esteemed partners to improve
                      healthcare through four core objectives:
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-cyan-400" : "text-amber-600"
                          }`}
                        >
                          •
                        </span>
                        Accelerating Financial Sustainability
                      </li>
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-cyan-400" : "text-amber-600"
                          }`}
                        >
                          •
                        </span>
                        Improving Strategic Information
                      </li>
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-cyan-400" : "text-amber-600"
                          }`}
                        >
                          •
                        </span>
                        Promoting Programmatic Sustainability
                      </li>
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-cyan-400" : "text-amber-600"
                          }`}
                        >
                          •
                        </span>
                        Removing Human Rights Barriers
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`p-6 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-800"
                        : "bg-orange-50/80 border-orange-200"
                    }`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? "text-blue-400" : "text-orange-600"
                      }`}
                    >
                      Our Partners
                    </h3>
                    <p>
                      Collaborating with organizations across South-East Asia
                      including:
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-blue-400" : "text-orange-600"
                          }`}
                        >
                          •
                        </span>
                        Save the Children Bhutan
                      </li>
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-blue-400" : "text-orange-600"
                          }`}
                        >
                          •
                        </span>
                        Youth for Health in Mongolia
                      </li>
                      <li className="flex items-start">
                        <span
                          className={`mr-2 ${
                            isDarkMode ? "text-blue-400" : "text-orange-600"
                          }`}
                        >
                          •
                        </span>
                        Action for Health Initiatives
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Approach Section */}
            <section
              className={`p-8 rounded-xl border shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-blue-400/30 text-gray-300"
                  : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 text-gray-700"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 neon-glow"
                    : "bg-gradient-to-r from-orange-600 to-red-600 sun-glow"
                }`}
              >
                Our Approach: Community-led Monitoring (CLM)
              </h2>
              <div className="prose max-w-none">
                <p className="mb-6 leading-relaxed">
                  This grassroots-driven initiative empowers local
                  community-based organizations and civil society groups to
                  gather invaluable data pertaining to HIV service quality.
                </p>
                <div
                  className={`mt-6 p-6 rounded-lg border ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
                      : "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDarkMode ? "text-purple-400" : "text-red-600"
                    }`}
                  >
                    Key Benefits
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          isDarkMode
                            ? "bg-purple-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          color={isDarkMode ? "#a78bfa" : "#dc2626"}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>Amplifies community voices</span>
                    </div>
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          isDarkMode ? "bg-blue-500/10" : "bg-orange-500/10"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          color={isDarkMode ? "#60a5fa" : "#f97316"}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>Improves service delivery</span>
                    </div>
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          isDarkMode ? "bg-cyan-500/10" : "bg-amber-500/10"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          color={isDarkMode ? "#22d3ee" : "#f59e0b"}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>Catalyzes health outcomes</span>
                    </div>
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          isDarkMode ? "bg-indigo-500/10" : "bg-pink-500/10"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          color={isDarkMode ? "#818cf8" : "#ec4899"}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span>Enables data-driven decisions</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Innovation Section */}
            <section
              className={`p-8 rounded-xl border shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-indigo-400/30 text-gray-300"
                  : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 text-gray-700"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-400 to-purple-400 neon-glow"
                    : "bg-gradient-to-r from-pink-600 to-red-600 sun-glow"
                }`}
              >
                Driving Innovation: Digital Solutions for Real-time Impact
              </h2>
              <div className="prose max-w-none">
                <p className="mb-6 leading-relaxed">
                  Central to our ethos is the relentless pursuit of innovation.
                  We recognize the pivotal role of technology in catalyzing
                  change.
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div
                    className={`p-6 rounded-lg border ${
                      isDarkMode
                        ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-900/50"
                        : "bg-gradient-to-br from-pink-50 to-red-50 border-pink-200"
                    }`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? "text-indigo-400" : "text-pink-600"
                      }`}
                    >
                      Digital Dashboards
                    </h3>
                    <p>
                      Real-time visualization of community health data for
                      informed decision-making.
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-lg border ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-900/50"
                        : "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200"
                    }`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? "text-blue-400" : "text-orange-600"
                      }`}
                    >
                      Data Collection Tools
                    </h3>
                    <p>
                      User-friendly interfaces for efficient community data
                      gathering.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Join Us Section */}
            <section
              className={`p-8 rounded-xl border shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-400/30 text-gray-300"
                  : "bg-white/80 backdrop-blur-sm border-orange-200 hover:border-orange-400/50 text-gray-700"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text mb-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 neon-glow"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 sun-glow"
                }`}
              >
                Join Us in Redefining Healthcare in Bhutan
              </h2>
              <div className="prose max-w-none">
                <p className="mb-6 leading-relaxed">
                  As we navigate the path ahead, we extend an open invitation to
                  all stakeholders, partners, and advocates to join us in our
                  quest for sustainable health equity.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutPage;