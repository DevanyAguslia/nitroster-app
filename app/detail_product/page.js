"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from '../contexts/CartContext';

// Combined product data
const products = [
    {
        id: 1,
        name: "Akahana",
        price: 30000,
        type: "coffee",
        img: "Menu1.png",
        description: "A sophisticated blend of smooth cold brew coffee and aromatic rose syrup. The 200ml canned beverage delivers a perfect harmony of bold coffee character and subtle floral sweetness. A refreshing unique coffee experience that elevates your daily ritual."
    },
    {
        id: 2,
        name: "Jungle Lush",
        price: 30000,
        type: "coffee",
        img: "Menu2.png",
        description: "A sophisticated blend of smooth cold brew tea with tropical fruit flavors. This 200ml canned beverage delivers a perfect harmony of refreshing tea character and subtle fruity sweetness. A vibrant, unique tea experience that elevates your daily ritual."
    },
    {
        id: 3,
        name: "Aceh Gayo",
        price: 30000,
        type: "coffee",
        img: "Menu3.png",
        description: "A sophisticated blend of smooth cold brew coffee with rich, bold flavors. This 200ml canned beverage delivers a perfect harmony of deep coffee character and subtle floral notes. A refreshing, specialty coffee experience that elevates your daily ritual."
    },
    {
        id: 4,
        name: "Snowberry",
        price: 30000,
        type: "tea",
        img: "Menu4.png",
        description: "A sophisticated blend of smooth cold brew tea with berry mojito flavors. This 200ml canned beverage delivers a perfect harmony of fruity freshness and subtle sweetness. A refreshing, unique tea experience that elevates your daily ritual."
    },
    {
        id: 5,
        name: "Rin-Go",
        price: 30000,
        type: "tea",
        img: "Menu5.png",
        description: "A sophisticated blend of smooth cold brew tea with apple mint flavors. This 200ml canned beverage delivers a perfect harmony of crisp apple sweetness. A refreshing, unique tea experience that elevates your daily ritual."
    },
    {
        id: 6,
        name: "Summer Days",
        price: 30000,
        type: "tea",
        img: "Menu6.png",
        description: "A sophisticated blend of smooth cold brew tea with lemon honey and butterscotch notes. This 200ml canned beverage delivers a perfect harmony of warm sweetness and citrusy freshness. A refreshing, unique tea experience that elevates your daily ritual."
    },
    {
        id: 7,
        name: "Pre-Order Ramadan Hampers",
        price: 300000,
        img: "Menu7.png",
        description: "Enjoy our limited-edition Banana Pandan Coffee and Pomelo Jasmine Tea, crafted for a unique, refreshing experience. Available in iced variants with a hamper bag and greeting card. Instant/same-day delivery, PO H-3. Grab yours before they're gone!"
    },
    {
        id: 8,
        name: "Pre-Order All Series Nitro Pack",
        price: 140000,
        img: "Menu8.jpg",
        description: "Experience all six Nitroster flavors in one bundle—Akahana, Jungle Lush, Aceh Gayo, Snowberry, Ringo, and Summer Days. Each can delivers a unique and refreshing nitro cold brew experience, perfect for any occasion."
    },
];

export default function DetailProduct() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) {
            const productId = parseInt(id);
            const foundProduct = products.find(p => p.id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
            }
        }
    }, [id]);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero section with integrated image and back button */}
            <div className="relative h-[53vh] bg-amber-800">
                {/* Product image as background */}
                <div className="absolute inset-0">
                    <Image
                        src={`/${product.img}`}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain"
                    />
                </div>

                {/* Back button overlay */}
                <div className="absolute top-0 left-0 p-4 z-10">
                    <Link href="/home" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>

                {/* Product title and price overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <p className="text-sm text-gray-200">{product.type ? `Rose Cold Brew Coffee` : "Special Item"}</p>

                            {/* Rating star */}
                            <div className="mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-lime-400">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-200">Price</p>
                            <p className="font-bold">Rp{product.price.toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product info */}
            <div className="bg-white p-6 flex-1 flex flex-col">
                {/* Description */}
                <div className="flex-grow">
                    <h3 className="text-gray-400 font-bold text-sm">Description</h3>
                    <p className="text-black mt-2 text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* Quantity control and Add to cart button */}
                <div className="mt-4 pb-14">
                    <div className="flex items-center justify-center mb-4">
                        <button
                            onClick={decreaseQuantity}
                            className="w-8 h-8 flex items-center justify-center border border-green-500 rounded-md bg-white text-green-500"
                        >
                            −
                        </button>
                        <span className="mx-6 text-black">{quantity}</span>
                        <button
                            onClick={increaseQuantity}
                            className="w-8 h-8 flex items-center justify-center border border-green-500 rounded-md bg-white text-green-500"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => addToCart(product, quantity)}
                        className="w-full bg-cyan-600 text-white py-3 px-4 rounded-full font-medium"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Bottom Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
                <Link href="/home">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs mt-1 text-blue-500">Home</span>
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