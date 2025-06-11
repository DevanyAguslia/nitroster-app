// app/thanks/page.js
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';;

const ThankYouPage = () => {
    const router = useRouter();

    const handleOrderAgain = () => {
        // Navigate to /home using router.push
        router.push('/home');
    };

    const handleGoBack = () => {
        router.back();
    };

    const [totalQuantity, setTotalQuantity] = useState(1);

    useEffect(() => {
        const updatePoints = async () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');

            // Hitung total quantity dari semua item di cart
            const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);

            if (user.email && totalQuantity > 0) {
                try {
                    await fetch('/api/profile/update-points', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user.email,
                            itemCount: totalQuantity
                        })
                    });

                    // Simpan quantity untuk ditampilkan
                    setTotalQuantity(totalQuantity);

                    // Clear cart setelah order selesai
                    localStorage.removeItem('cart');
                } catch (error) {
                    console.error('Failed to update points:', error);
                }
            }
        };

        updatePoints();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-start p-4 bg-white">
                <button onClick={handleGoBack} className="p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {/* Thank You Message */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Thank You for Ordering!
                </h1>

                {/* Bonus Points */}
                <p className="text-base text-gray-600 mb-8">
                    You've got bonus <span className="text-green-600 font-semibold">+{totalQuantity * 10} points</span>
                </p>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <img
                        src="/qr-code.png"
                        alt="QR Code for Order"
                        className="w-48 h-48"
                    />
                </div>

                {/* Instruction Text */}
                <p className="text-center text-gray-600 mb-12 max-w-xs">
                    Scan the barcode at the pickup stall to get your order
                </p>

                {/* Order Again Button */}
                <button
                    onClick={handleOrderAgain}
                    className="w-full max-w-sm bg-cyan-600 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors duration-200"
                >
                    Order Again
                </button>
            </div>

            {/* Bottom Indicator */}
            <div className="flex justify-center pb-4">
                <div className="w-32 h-1 bg-black rounded-full"></div>
            </div>
        </div>
    );
};

export default ThankYouPage;