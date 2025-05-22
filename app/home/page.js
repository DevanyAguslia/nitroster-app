//home/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from '../contexts/CartContext';

const allMenus = [
    { id: 1, name: "Akahana", price: 30000, type: "coffee", img: "Menu1.png" },
    { id: 2, name: "Jungle Lush", price: 30000, type: "coffee", img: "Menu2.png" },
    { id: 3, name: "Aceh Gayo", price: 30000, type: "coffee", img: "Menu3.png" },
    { id: 4, name: "Snowberry", price: 30000, type: "tea", img: "Menu4.png" },
    { id: 5, name: "Rin-Go", price: 30000, type: "tea", img: "Menu5.png" },
    { id: 6, name: "Summer Days", price: 30000, type: "tea", img: "Menu6.png" },
];

const specialMenus = [
    { id: 7, name: "Pre-Order Ramadan Hampers", price: 300000, img: "Menu7.png" },
    { id: 8, name: "Pre-Order All Series Nitro Pack", price: 140000, img: "Menu8.jpg" },
];

export default function Home() {
    const { addToCart } = useCart();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMenus =
        filter === "all"
            ? allMenus.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : allMenus.filter((m) => m.type === filter && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredSpecialMenus = specialMenus.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen w-full bg-white pb-28">
            <header className="p-4">
                <div className="flex justify-between items-center">
                    <Image src="/Nitroster Logo.jpg" alt="NiTRŌSFER" width={120} height={40} className="w-auto h-auto" />
                    <Image src="/profile.png" alt="profile" width={32} height={32} className="rounded-full" />
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 border rounded-full shadow-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <Image src="/Nitroster cover.jpg" alt="Banner" width={500} height={150} className="rounded-md w-full" />
                </div>

                <div className="mt-4 flex space-x-4 text-sm font-semibold">
                    {["all", "coffee", "tea"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`${filter === type ? "text-blue-600 underline" : "text-gray-500"}`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {/* Product Grid */}
            <main className="px-4 grid grid-cols-2 gap-4">
                {filteredMenus.map((item) => (
                    <div key={item.id} className="flex flex-col items-start">
                        <Link href={`/detail_product?id=${item.id}`} className="w-full">
                            <Image src={`/${item.img}`} alt={item.name} width={150} height={150} className="rounded-lg w-full" />
                            <h2 className="text-sm mt-2 font-semibold">{item.name}</h2>
                            <p className="text-sm text-gray-600">Rp{item.price.toLocaleString("id-ID")}</p>
                        </Link>
                        <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-cyan-600 text-white py-1 px-3 rounded-full font-medium"
                        >
                            Add
                        </button>
                    </div>
                ))}
            </main>

            {/* Special Menu */}
            {filter === "all" && filteredSpecialMenus.length > 0 && (
                <section className="mt-6 px-4">
                    <h2 className="font-semibold mb-2">Special Menu</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {filteredSpecialMenus.map((item) => (
                            <div key={item.id} className="flex flex-col items-start">
                                <Link href={`/detail_product?id=${item.id}`} className="w-full">
                                    <Image src={`/${item.img}`} alt={item.name} width={150} height={150} className="rounded-lg w-full" />
                                    <h2 className="text-sm mt-2 font-semibold">{item.name}</h2>
                                    <p className="text-sm text-gray-600">Rp{item.price.toLocaleString("id-ID")}</p>
                                </Link>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-cyan-600 text-white py-1 px-3 rounded-full font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Bottom Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
                <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs mt-1 text-blue-500">Home</span>
                </div>

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

                <Link href="/profile">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">Profile</span>
                    </div>
                </Link>
            </nav>
        </div>
    );
}