"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout, isGuest } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Set initial values when user data is available
    useEffect(() => {
        if (user) {
            const userName = user.name || user.email?.split('@')[0] || "User";
            const userEmail = user.email || "";

            setName(userName);
            setEmail(userEmail);
            setOriginalName(userName);
            setOriginalEmail(userEmail);
        } else if (isGuest) {
            // Guest mode - set default values
            setName("Guest User");
            setEmail("guest@example.com");
            setOriginalName("Guest User");
            setOriginalEmail("guest@example.com");
        }
    }, [user, isGuest]);

    // Redirect to login if not authenticated and not guest
    useEffect(() => {
        if (!user && !isGuest) {
            router.push("/");
        }
    }, [user, isGuest, router]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSave = async () => {
        setError("");
        setSuccessMessage("");

        // Basic validation
        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        // For guest users, just show a message
        if (isGuest) {
            alert("Guest users cannot save profile changes. Please login to save changes.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                setOriginalName(name);
                setOriginalEmail(email);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            setError("An error occurred while updating profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();

            // Clear guest mode if it was set
            localStorage.removeItem('isGuest');

            // Redirect to login page
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            alert("An error occurred during logout");
        }
    };

    // Check if there are unsaved changes
    const hasUnsavedChanges = name !== originalName || email !== originalEmail;

    // Show loading state while checking authentication
    if (!user && !isGuest) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-white">
            {/* Profile Info */}
            <main className="flex-1 px-6 pt-6 pb-24">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <Image
                            src="/coffeeprofile.jpg"
                            alt="Profile"
                            width={100}
                            height={100}
                            className="rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-1.5A2.5 2.5 0 1113.5 6.5L4 16v4h4l9.5-9.5z" />
                            </svg>
                        </div>
                    </div>

                    {/* Points */}
                    <div className="mt-4 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.172L12 18.896l-7.336 3.858 1.402-8.172L.132 9.21l8.2-1.192z" />
                        </svg>
                        <span className="text-lg font-semibold text-gray-800">
                            {isGuest ? '0 Points' : '1100 Points'}
                        </span>
                    </div>

                    {/* Guest Mode Indicator */}
                    {isGuest && (
                        <div className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                            Guest Mode
                        </div>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Name and Email Inputs */}
                <div className="mt-8 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={isGuest}
                        />
                        {isGuest && (
                            <p className="text-xs text-gray-500 mt-1">Login to edit your profile</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={isGuest}
                        />
                        {isGuest && (
                            <p className="text-xs text-gray-500 mt-1">Login to edit your profile</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col space-y-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !hasUnsavedChanges}
                        className={`py-2 rounded-md shadow transition duration-150 ${isLoading || !hasUnsavedChanges
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <div className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Saving...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 rounded-md shadow hover:bg-red-600 transition duration-150"
                    >
                        {isGuest ? "Exit Guest Mode" : "Log Out"}
                    </button>
                </div>
            </main>

            {/* Bottom Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
                <Link href="/home">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">Home</span>
                    </div>
                </Link>

                <Link href="/payment">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">Cart</span>
                    </div>
                </Link>

                <Link href="/history">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">History</span>
                    </div>
                </Link>

                <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-1 text-blue-500">Profile</span>
                </div>
            </nav>
        </div>
    );
}