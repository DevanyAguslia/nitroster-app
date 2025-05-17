"use client";

import Image from "next/image";
import { cartItems } from "./libs/cartItems";
import Checkout from "./components/Checkout";
import { useEffect, useState } from "react";

export default function Home() {
  const [cartProducts, setCartProducts] = useState(cartItems);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
    const clientKey = process.env.NEXT_PUBLIC_CLIENT
    const script = document.createElement('script')
    script.src = snapScript
    script.setAttribute('data-client-key', clientKey)
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, []);

  const decreaseQuantity = (id) => {
    setCartProducts(cartProducts.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const increaseQuantity = (id) => {
    setCartProducts(cartProducts.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Menghitung total harga dari semua item
  const totalAmount = cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white py-4 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-black">My Cart</h1>
        </div>
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src="/profile-placeholder.jpg" alt="Profile" className="h-full w-full object-cover" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="p-4">
            {cartProducts.map((item) => (
              <div key={item.id} className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
                {/* Product Image */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Product Info */}
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-blue-500">{item.description}</p>
                      <p className="text-sm font-medium text-gray-900">Rp{item.price.toLocaleString('id-ID')}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-gray-500 w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full"
                      >
                        <span className="text-lg font-medium">-</span>
                      </button>
                      <span className="mx-3 w-4 text-center text-black">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="text-gray-500 w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full"
                      >
                        <span className="text-lg font-medium">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Total Amount and Checkout */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Total</h3>
                <p className="text-lg font-bold text-black">Rp{totalAmount.toLocaleString('id-ID')}</p>
              </div>

              {/* Pass both cartItems and totalAmount to Checkout component */}
              <Checkout cartItems={cartProducts} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navbar */}
      <nav className="bg-white px-4 py-3 flex items-center justify-around shadow-inner">
        <button className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1 text-gray-500">Home</span>
        </button>

        <button className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs mt-1 text-blue-500">Cart</span>
        </button>

        <button className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1 text-gray-500">History</span>
        </button>

        <button className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1 text-gray-500">Profile</span>
        </button>
      </nav>
    </div>
  );
}