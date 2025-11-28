// app/(main)/layout.js

import Navbar from '../components/navbar'; // Adjust path if needed
import Footer from '../components/footer'; // Adjust path if needed

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}