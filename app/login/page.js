"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Add Poppins font to the document
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add Poppins as default font to the entire page
    document.body.style.fontFamily = "'Poppins', sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  const handleToggleView = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        
        console.log("Login successful:", data);
        
        // Redirect to home page after successful login
        router.push("/");
      } else {
        // Sign up logic
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        
        if (password.length < 8) {
          setError("Password must be at least 8 characters long");
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Sign up failed");
        }
        
        console.log("Sign up successful:", data);
        
        // Redirect to home page after successful signup
        router.push("/");
      }
    } catch (error) {
      setError(error.message || (isLogin ? "Login failed. Please check your credentials." : "Sign up failed. Please try again."));
      console.error(isLogin ? "Login error:" : "Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinueAsGuest = () => {
    router.push("/"); // Redirect to home page as guest
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo and Tagline */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="relative w-32 h-32 mb-2">
            <Image 
              src="/Logo.png" 
              alt="NITROSTER Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <p className="text-lg font-medium mt-2 text-gray-800">Your Nitro Journey Starts Here!</p>
        </div>
        
        {/* Form Container */}
        <div className="w-full bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            {isLogin ? "Log in" : "Sign Up"}
          </h2>
          <p className="text-center mb-6 text-gray-600">
            {isLogin ? "Log in with your email" : "Sign up with your email"}
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                required
              />
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Confirm Password Field (only for signup) */}
            {!isLogin && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="confirm password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {isLogin ? "Log In" : "Sign Up"}
              </button>
              
              {/* Continue as Guest Button */}
              <button
                type="button"
                onClick={handleContinueAsGuest}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </form>
          
          {/* Toggle between Login and Signup */}
          <div className="text-center mt-6 text-gray-700">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={handleToggleView}
                  className="text-teal-600 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={handleToggleView}
                  className="text-teal-600 font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
          
          {/* Terms and Privacy */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="text-black font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-black font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}