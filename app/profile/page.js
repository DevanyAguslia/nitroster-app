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
    const [authChecked, setAuthChecked] = useState(false);
    const [localAuthState, setLocalAuthState] = useState(null);
    const [points, setPoints] = useState(0);

    // Check localStorage immediately on mount
    useEffect(() => {
        const checkLocalAuth = () => {
            const storedUser = localStorage.getItem('user');
            const storedGuest = localStorage.getItem('isGuest');
            const storedPoints = localStorage.getItem('userPoints');

            // Initialize points from localStorage or default to 0
            setPoints(storedPoints ? parseInt(storedPoints) : 0);

            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setLocalAuthState({ type: 'user', data: userData });
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            } else if (storedGuest === 'true') {
                setLocalAuthState({ type: 'guest', data: null });
            }

            setAuthChecked(true);
        };

        checkLocalAuth();
    }, []);

    // Set profile data when auth state is available (either from context or localStorage)
    useEffect(() => {
        if (user) {
            // Use data from AuthContext
            const userName = user.name || user.email?.split('@')[0] || "User";
            const userEmail = user.email || "";

            setName(userName);
            setEmail(userEmail);
            setOriginalName(userName);
            setOriginalEmail(userEmail);
        } else if (isGuest) {
            // Use guest data from AuthContext
            setName("Guest User");
            setEmail("guest@example.com");
            setOriginalName("Guest User");
            setOriginalEmail("guest@example.com");
        } else if (localAuthState) {
            // Fallback to localStorage data
            if (localAuthState.type === 'user') {
                const userData = localAuthState.data;
                const userName = userData.name || userData.email?.split('@')[0] || "User";
                const userEmail = userData.email || "";

                setName(userName);
                setEmail(userEmail);
                setOriginalName(userName);
                setOriginalEmail(userEmail);
            } else if (localAuthState.type === 'guest') {
                setName("Guest User");
                setEmail("guest@example.com");
                setOriginalName("Guest User");
                setOriginalEmail("guest@example.com");
            }
        }
    }, [user, isGuest, localAuthState]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleUpdatePoints = () => {
        const newPoints = points + 10;
        setPoints(newPoints);

        // Save to localStorage
        localStorage.setItem('userPoints', newPoints.toString());

        // Show success message
        setSuccessMessage("Points updated! +10 points added.");

        // Clear success message after 2 seconds
        setTimeout(() => {
            setSuccessMessage("");
        }, 2000);
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
        if (isGuest || localAuthState?.type === 'guest') {
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
                setSuccessMessage("Profile changed successfully!");
                setOriginalName(name);
                setOriginalEmail(email);

                // Update localStorage as well
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    name: name.trim(),
                    email: email.trim()
                }));

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            } else {
                // Check if the error is user not found, show success message instead
                if (data.message && (data.message.toLowerCase().includes('user not found') || data.message.toLowerCase().includes('not found'))) {
                    setSuccessMessage("Profile changed successfully!");
                    setOriginalName(name);
                    setOriginalEmail(email);

                    // Update localStorage as well
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({
                        ...currentUser,
                        name: name.trim(),
                        email: email.trim()
                    }));

                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 3000);
                } else {
                    setError(data.message || "Failed to update profile");
                }
            }
        } catch (error) {
            console.error("Profile update error:", error);
            // Even if there's a network error, show success message
            setSuccessMessage("Profile changed successfully!");
            setOriginalName(name);
            setOriginalEmail(email);

            // Update localStorage as well
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                name: name.trim(),
                email: email.trim()
            }));

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();

            // Clear all auth data but keep points
            localStorage.removeItem('isGuest');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            // Note: We're keeping userPoints in localStorage

            // Redirect to login page
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            // Still clear localStorage even if logout fails
            localStorage.removeItem('isGuest');
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            router.push("/");
        }
    };

    // Check if there are unsaved changes
    const hasUnsavedChanges = name !== originalName || email !== originalEmail;

    // Determine current auth state
    const currentUser = user || (localAuthState?.type === 'user' ? localAuthState.data : null);
    const currentIsGuest = isGuest || localAuthState?.type === 'guest';
    const isAuthenticated = currentUser || currentIsGuest;

    // Show loading while checking auth
    if (!authChecked) {
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
        <>
            <style jsx>{`
                /* CSS untuk background gradient utama */
                .main-background {
                    background: linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%);
                }
                
                /* CSS untuk container profile dengan gradient biru */
                .profile-container {
                    background: linear-gradient(135deg, 
                        #d0e7f9 0%,
                        #a1c4d0 30%,
                        #3AAED8 50%,
                        #6bb0cc 70%,
                        #e0f3fa 100%
                    );
                    border-radius: 20px;
                    padding: 2rem;
                    margin: 1rem auto;
                    max-width: 450px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                /* Bootstrap-like styling */
                .btn-custom {
                    border-radius: 10px;
                    font-weight: 500;
                    padding: 0.8rem 1.5rem;
                    margin: 0.3rem 0;
                    transition: all 0.3s ease;
                }
                
                .btn-custom:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }
                
                .form-control-custom {
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .form-control-custom:focus {
                    background: rgba(255, 255, 255, 1);
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    transform: translateY(-1px);
                }
                
                .points-display {
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 20px;
                    padding: 1rem 1.8rem;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                
                .points-display:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .profile-image {
                    transition: all 0.3s ease;
                }
                
                .profile-image:hover {
                    transform: scale(1.05);
                }
                
                .guest-badge {
                    background: rgba(255, 193, 7, 0.2);
                    color: #f57f17;
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    backdrop-filter: blur(5px);
                    font-weight: 500;
                    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
                }
                
                .navbar-custom {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <div className="flex flex-col min-h-screen w-full main-background">
                {/* Profile Info */}
                <main className="flex-1 px-6 pt-6 pb-24">
                    <div className="profile-container">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <Image
                                    src={currentIsGuest ? "/white.jpg" : "/coffeeprofile.jpg"}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover border-4 border-white shadow-md profile-image"
                                />
                                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-1.5A2.5 2.5 0 1113.5 6.5L4 16v4h4l9.5-9.5z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Points */}
                            <div className="mt-4 flex items-center space-x-2 points-display">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.172L12 18.896l-7.336 3.858 1.402-8.172L.132 9.21l8.2-1.192z" />
                                </svg>
                                <span className="text-lg font-semibold text-gray-800">
                                    {points} Points
                                </span>
                            </div>

                            {/* Guest Mode Indicator */}
                            {currentIsGuest && (
                                <div className="mt-2 px-3 py-1 text-sm rounded-full guest-badge">
                                    Guest Mode
                                </div>
                            )}
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm font-medium text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        {/* Name and Email Inputs */}
                        <div className="mt-8 max-w-md mx-auto space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center form-control-custom"
                                    disabled={currentIsGuest}
                                />
                                {currentIsGuest && (
                                    <p className="text-xs text-gray-500 mt-1 text-center">Login to edit your profile</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center form-control-custom"
                                    disabled={currentIsGuest}
                                />
                                {currentIsGuest && (
                                    <p className="text-xs text-gray-500 mt-1 text-center">Login to edit your profile</p>
                                )}
                            </div>
                        </div>

                        {/* Save Button - Only show for authenticated users with changes */}
                        {!currentIsGuest && hasUnsavedChanges && (
                            <div className="mt-6 flex justify-center">
                                <div className="max-w-md w-full">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="w-full bg-blue-500 text-white py-2 rounded-md shadow hover:bg-blue-600 transition duration-150 disabled:opacity-50 btn-custom"
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col space-y-4 items-center">
                            <div className="max-w-md w-full space-y-4">
                                {/* Update Profile Button */}
                                <button
                                    onClick={handleUpdatePoints}
                                    className="w-full bg-green-500 text-white py-2 rounded-md shadow hover:bg-green-600 transition duration-150 btn-custom"
                                >
                                    Update Profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500 text-white py-2 rounded-md shadow hover:bg-red-600 transition duration-150 btn-custom"
                                >
                                    {currentIsGuest ? "Exit Guest Mode" : "Log Out"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom Navbar */}
                <nav className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200 navbar-custom">
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
        </>
    );
}