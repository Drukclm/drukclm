// app/layout.js (This is the updated version)

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/theme-provider";
import AuthListener from "./components/AuthListener";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Druk CLM - Community Led Monitoring",
  description: "Empowering communities through data-driven healthcare monitoring in Bhutan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ThemeProvider wraps everything, which is correct */}
        <ThemeProvider>
          {/* We only render the children passed in from the active layout group */}
           <AuthListener>
{children}
           </AuthListener>
          
        </ThemeProvider>
      </body>
    </html>
  );
}