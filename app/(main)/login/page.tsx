'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "../../store/themeStore";
import { supabase } from "../../../lib/supabaseClinent";

export default function LoginPage() {
  const { isDarkMode } = useThemeStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //handle login
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);

  //   // CHANGE: We will use a try/catch block for better error handling
  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({ email, password });
      
  //     if (error) {
  //       // If Supabase returns an error, we show it and stop loading.
  //       setError("Invalid email or password. Please try again.");
  //       setIsLoading(false); // Stop loading on failure
  //       return; // Exit the function here
  //     }
      
  //     // CHANGE: Instead of router.refresh(), we push to the new page.
  //     // The spinner will stay visible until the new page is loaded.
      
  //     // await router.push('/dashboard'); 

  //     await router.push(profileData?.role?.toLowerCase() === 'kpo' ? '/kpo-dashboard' : '/dashboard');
  //   } catch (e) {
  //     // This catches any other unexpected errors.
  //     setError("An unexpected error occurred. Please try again.");
  //     setIsLoading(false);
  //   }
  // };
 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
     setIsLoading(true);

    try {
    
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error || !data.user) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }
      
      //  Use the user's ID to fetch their profile and role
      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('role')
        .eq('auth_id', data.user.id)
        .single();

      if (profileError) {
        setError("Could not get user role after login.");
        setIsLoading(false);
        return;
      }
      
      // NOW redirect to the correct dashboard
      await router.push(profileData?.role?.toLowerCase() === 'kpo' ? '/kpo-dashboard' : '/dashboard');

    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 py-16 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white"
          : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 text-gray-800"
      }`}
    >
      <div
        className={`relative max-w-md w-full rounded-xl p-10 shadow-lg backdrop-blur-sm border ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-orange-200"
        }`}
      >
        <h2
          className={`text-center text-3xl font-bold mb-2 bg-clip-text text-transparent ${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300"
              : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
          }`}
        >
          Login at Druk CLM
        </h2>
        <h5 className="text-center text-sm mb-8 opacity-80">
          Please login to continue
        </h5>

        <form onSubmit={handleLogin} className="space-y-6">
        
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-white border-orange-300 text-gray-800 focus:ring-orange-400"
              }`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-cyan-400"
                  : "bg-white border-orange-300 text-gray-800 focus:ring-orange-400"
              }`}
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

    {/* showing loading state */}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-md transition-colors duration-300 flex justify-center items-center ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            } ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}