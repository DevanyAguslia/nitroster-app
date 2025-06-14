// app/payment/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";
import Checkout from "../components/Checkout";
import { useEffect } from "react";

export default function Payment() {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const decreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDeleteItem = (id) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      removeFromCart(id);
    }
  };

  const pageStyle = {
    background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)',
    minHeight: '100vh'
  };

  const cardStyle = {
    border: 'none'
  };

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
      />

      {/* Custom CSS to override Bootstrap card styles */}
      <style jsx>{`
        .custom-white-card {
          background: white !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          border: none !important;
        }
      `}</style>

      <div className="d-flex flex-column" style={pageStyle}>
        {/* Header/Navbar */}
        <header className="bg-white py-3 px-4 shadow-sm">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Link href="/home" className="me-3 text-decoration-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="h4 mb-0 text-dark fw-semibold">My Cart</h1>
              </div>
              <div className="rounded-circle overflow-hidden" style={{ width: '32px', height: '32px' }}>
                <img src="/coffeeprofile.jpg" alt="Profile" className="w-100 h-100 object-fit-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 px-4 py-4" style={{ paddingBottom: '80px' }}>
          <div className="container-fluid">
            {cartItems.length === 0 ? (
              // Empty Cart State
              <div className="card text-center p-5 custom-white-card" style={cardStyle}>
                <div className="card-body">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mx-auto" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="h5 text-dark mb-3">Your cart is empty</h3>
                  <p className="text-muted mb-4">Add some products to your cart to get started.</p>
                  <Link href="/home" className="btn btn-info text-white px-4 py-2 rounded-pill fw-medium text-decoration-none">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              // Cart Items
              <div className="card mb-4 custom-white-card" style={cardStyle}>
                <div className="card-body p-4">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className={`d-flex align-items-center py-3 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                      {/* Product Image */}
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-light rounded overflow-hidden" style={{ width: '64px', height: '64px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h3 className="h6 text-dark mb-1">{item.name}</h3>
                            <p className="small text-info mb-1">{item.description}</p>
                            <p className="small fw-medium text-dark mb-0">Rp{item.price.toLocaleString('id-ID')}</p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn btn-sm btn-outline-danger border-0 rounded-circle ms-2"
                            style={{ width: '32px', height: '32px' }}
                            title="Hapus item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center mt-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="btn btn-sm btn-outline-secondary border rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '24px', height: '24px' }}
                          >
                            <span className="fw-medium">-</span>
                          </button>
                          <span className="mx-3 text-dark fw-medium" style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="btn btn-sm btn-outline-secondary border rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '24px', height: '24px' }}
                          >
                            <span className="fw-medium">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Amount and Checkout */}
                  <div className="mt-4 pt-4 bg-white sticky-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h5 text-dark mb-0">Total</h3>
                      <p className="h5 fw-bold text-dark mb-0">Rp{getTotalAmount().toLocaleString('id-ID')}</p>
                    </div>

                    {/* Pass cartItems to Checkout component */}
                    <Checkout cartItems={cartItems} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Navbar */}
        <nav className="navbar fixed-bottom bg-white border-top shadow-lg">
          <div className="container-fluid px-4 py-3">
            <div className="d-flex w-100 justify-content-around">
              <Link href="/home" className="text-decoration-none">
                <div className="d-flex flex-column align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="small text-muted">Home</span>
                </div>
              </Link>

              <div className="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-info mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="small text-info">Cart</span>
              </div>

              <Link href="/history" className="text-decoration-none">
                <div className="d-flex flex-column align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="small text-muted">History</span>
                </div>
              </Link>

              <Link href="/profile" className="text-decoration-none">
                <div className="d-flex flex-column align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="small text-muted">Profile</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Bootstrap JS CDN */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}