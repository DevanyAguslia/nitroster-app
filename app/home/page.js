"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
    const [mounted, setMounted] = useState(false);

    const filteredMenus =
        filter === "all"
            ? allMenus.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : allMenus.filter((m) => m.type === filter && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredSpecialMenus = specialMenus.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleAddToCart = (item) => {
        addToCart(item);
        window.alert("You've already added drink to cart, please check the cart list");
    };

    return (
        <>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            {/* Custom CSS */}
            <style jsx>{`
                :root {
                    --lime-green: #CEFF1A;
                    --dark-green: #222F2B;
                    --sky-blue: #3AAED8;
                   --light-gray: #F7F7FF; 
                    --lavender: #EADEEE;
                }
                
                .gradient-bg {
                    background: linear-gradient(
                        135deg,
                        #ffffff 0%,
                        #d8cde6 20%,
                        #eaddee 40%,
                        #c5b8d6 60%,
                        #ffffff 80%
                    );
                    min-height: 100vh;
                    padding-bottom: 100px;
                }
                
                .header-gradient {
                    background: linear-gradient(135deg, var(--dark-green) 0%, var(--sky-blue) 50%, #5BB8E5 100%);
                    color: white !important;
                    border-radius: 0 0 30px 30px;
                    box-shadow: 0 8px 30px rgba(34, 47, 43, 0.3);
                    backdrop-filter: blur(20px);
                }
                
                .search-input {
                    border: 3px solid var(--lime-green);
                    border-radius: 30px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    transition: all 0.4s ease;
                    padding: 15px 20px;
                    font-size: 1rem;
                    color: #000000 !important;
                    box-shadow: 0 5px 20px rgba(206, 255, 26, 0.2);
                }
                
                .search-input::placeholder {
                    color: #666 !important;
                }
                
                .search-input:focus {
                    color: #000000 !important;
                }
                
                .search-input:focus {
                    border-color: var(--lime-green);
                    box-shadow: 0 0 25px rgba(206, 255, 26, 0.5);
                    outline: none;
                    transform: translateY(-2px);
                    color: #000000 !important;
                }
                
                .filter-btn {
                    padding: 12px 25px;
                    border-radius: 25px;
                    border: 3px solid var(--lime-green);
                    background: #3AAED8;
                    color: #000000 !important;
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: all 0.4s ease;
                    box-shadow: 0 5px 15px rgba(206, 255, 26, 0.2);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .filter-btn.active {
                    background: linear-gradient(45deg, var(--lime-green), #32CD32);
                    color: #000000 !important;
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 25px rgba(206, 255, 26, 0.4);
                    border-color: #32CD32;
                }
                
                .filter-btn:hover {
                    background: linear-gradient(45deg, var(--sky-blue), var(--lime-green));
                    color: #000000 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(58, 174, 216, 0.3);
                }
                
                .product-card {
                    background: linear-gradient(
                        135deg,
                        #d0e7f9 0%,
                        #a1c4d0 30%,
                        #3AAED8 50%,
                        #6bb0cc 70%,
                        #e0f3fa 100%
                    );
                    border-radius: 25px;
                    border: 2px solid rgba(206, 255, 26, 0.3);
                    box-shadow: 0 10px 30px rgba(34, 47, 43, 0.1);
                    transition: all 0.4s ease;
                    backdrop-filter: blur(15px);
                    overflow: hidden;
                    position: relative;
                }
                
                .product-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, var(--lime-green), var(--sky-blue), var(--lime-green));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .product-card:hover::before {
                    opacity: 1;
                }
                
                .product-card .card-title {
                    color: #000000 !important;
                    font-weight: 800;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                }
                
                .product-card .card-text {
                    color: #000000 !important;
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .product-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(58, 174, 216, 0.25);
                    border-color: var(--lime-green);
                }
                
                .product-img {
                    border-radius: 20px;
                    transition: all 0.4s ease;
                    border: 2px solid rgba(206, 255, 26, 0.2);
                }
                
                .product-card:hover .product-img {
                    transform: scale(1.08) rotate(2deg);
                    border-color: var(--lime-green);
                }
                
                .add-btn {
                    background: var(--lime-green);
                    border: none;
                    border-radius: 100px;
                    color: #000000 !important;
                    font-weight: 700;
                    padding: 12px 25px;
                    transition: all 0.4s ease;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.9rem;
                    display: block;
                    margin: 0 auto;
                }
                
                .add-btn:hover {
                    background: linear-gradient(45deg, var(--lime-green), #32CD32);
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 25px rgba(19, 19, 19, 0.5);
                    color: #000000 !important;
                }
                
                .special-card {
                    background: linear-gradient(
                        135deg,
                        #faffd2 0%,
                        #e5ffc7 25%,
                        #ccff99 50%,
                        #e5ffc7 75%,
                        #faffd2 100%
                    );
                    border: 3px solid var(--lime-green);
                    position: relative;
                    overflow: hidden;
                    z-index: 0;
                    color: #000000 !important; 
                }
                
                .special-card .card-title {
                    color: #000000 !important;
                }
                
                .special-card .card-text {
                    color: #000000 !important;
                }
                
                .special-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 200%;
                    height: 100%;
                    background: linear-gradient(
                        120deg,
                        rgba(255, 255, 255, 0.05) 0%,
                        rgba(255, 255, 255, 0.4) 50%,
                        rgba(255, 255, 255, 0.05) 100%
                    );
                    transform: skewX(-20deg);
                    animation: shine-lime 4s infinite;
                    pointer-events: none;
                    z-index: 1;
                }
                
                @keyframes shine-lime {
                    from { left: -100%; }
                    to { left: 100%; }
                }
                
                .special-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(206, 255, 26, 0.3), transparent);
                    transition: left 0.6s ease;
                }
                
                .special-card:hover::after {
                    left: 100%;
                }
                
                .points-badge {
                    background: #32CD32;
                    color: #000000 !important;
                    font-weight: 800;
                    border-radius: 25px;
                    padding: 8px 15px;
                    font-size: 0.85rem;
                    box-shadow: 0 5px 15px rgba(206, 255, 26, 0.5);
                    animation: pulse 2s infinite;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border: 2px solid #32CD32;
                }
                
                @keyframes pulse {
                    0% { 
                        box-shadow: 0 5px 15px rgba(206, 255, 26, 0.5);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 8px 25px rgba(206, 255, 26, 0.8);
                        transform: scale(1.05);
                    }
                    100% { 
                        box-shadow: 0 5px 15px rgba(206, 255, 26, 0.5);
                        transform: scale(1);
                    }
                }
                
                .banner-img {
                    border-radius: 10px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                    border: 2px solid var(--lime-green);
                    transition: all 0.4s ease;
                    margin-top: -8px;
                    max-height: 100%;
                    object-fit: cover;
                }
                
                .banner-img:hover {
                    transform: scale(1.02);
                    box-shadow: 0 15px 40px rgba(206, 255, 26, 0.3);
                }
                
                .logo-profile {
                    border: 3px solid var(--lime-green);
                    box-shadow: 0 5px 15px rgba(206, 255, 26, 0.3);
                    transition: all 0.3s ease;
                }
                
                .logo-profile:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 20px rgba(206, 255, 26, 0.5);
                }
                
                .container-main {
                    padding: 0 20px;
                    margin-bottom: 40px;
                }
                
                .extra-content {
                    margin-top: 50px;
                    margin-bottom: 50px;
                }
                
                .section-title {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #000000 !important;
                    text-shadow: 1px 1px 1px rgba(0,0,0,1);
                    margin-bottom: 1.5rem;
                }
                
                /* Empty State Styles */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 25px;
                    border: 2px dashed var(--lime-green);
                    margin: 20px 0;
                }
                
                .empty-state-icon {
                    font-size: 4rem;
                    color: var(--sky-blue);
                    margin-bottom: 20px;
                    opacity: 0.7;
                }
                
                .empty-state-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--dark-green);
                    margin-bottom: 10px;
                }
                
                .empty-state-message {
                    color: #666;
                    font-size: 1rem;
                    margin-bottom: 20px;
                }
                
                .clear-search-btn {
                    background: var(--lime-green);
                    border: none;
                    border-radius: 25px;
                    padding: 10px 20px;
                    color: #000000 !important;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .clear-search-btn:hover {
                    background: #32CD32;
                    transform: translateY(-2px);
                }
                    
                @media (max-width: 768px) {
                    .product-card {
                        margin-bottom: 20px;
                    }
                    
                    .section-title {
                      font-size: 1.8rem;
                      font-weight: bold;
                      color: #000000 !important;
                      text-shadow: 1px 1px 1px rgba(0,0,0,1);
                      margin-bottom: 1.5rem;
                    }
                    
                    .filter-btn {
                        padding: 10px 20px;
                        font-size: 0.9rem;
                    }
                    
                    .empty-state {
                        padding: 40px 15px;
                    }
                    
                    .empty-state-icon {
                        font-size: 3rem;
                    }
                    
                    .empty-state-title {
                        font-size: 1.3rem;
                    }
                }
            `}</style>

            <div className="gradient-bg pb-5">
                {/* Header */}
                <header className="header-gradient p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Image
                            src="/nitroster-logo.png"
                            alt="NITROSTER"
                            width={120}
                            height={40}
                            className="img-fluid logo-profile rounded-3"
                        />
                        <Image
                            src="/coffeeprofile.jpg"
                            alt="profile"
                            width={45}
                            height={45}
                            className="rounded-circle logo-profile"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search your favorite drinks..."
                            className="form-control search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <Image
                            src="/Nitroster cover.jpg"
                            alt="Banner"
                            width={500}
                            height={150}
                            className="img-fluid banner-img w-100"
                        />
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                        {["all", "coffee", "tea"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`btn filter-btn ${filter === type ? "active" : ""}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Product Grid */}
                <main className="container-main mt-5">
                    {filteredMenus.length === 0 && filteredSpecialMenus.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔍</div>
                            <h3 className="empty-state-title">Tidak ada hasil ditemukan</h3>
                            <p className="empty-state-message">
                                Maaf, tidak ada minuman yang sesuai dengan pencarian "{searchQuery}".
                                <br />
                                Coba kata kunci lain atau hapus filter pencarian.
                            </p>
                            <button
                                className="btn clear-search-btn"
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilter("all");
                                }}
                            >
                                Hapus Pencarian
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filteredMenus.map((item) => (
                                <div key={item.id} className="col-6">
                                    <div className="card product-card h-100 p-3">
                                        <Link href={`/detail_product?id=${item.id}`} className="text-decoration-none">
                                            <Image
                                                src={`/${item.img}`}
                                                alt={item.name}
                                                width={150}
                                                height={150}
                                                className="card-img-top product-img w-100"
                                            />
                                            <div className="card-body p-0 mt-3">
                                                <h6 className="card-title">{item.name}</h6>
                                                <p className="card-text">Rp{item.price.toLocaleString("id-ID")}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn add-btn w-100 mt-3"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Special Menu Section */}
                {filter === "all" && filteredSpecialMenus.length > 0 && (
                    <section className="container-main mt-5">
                        <h3 className="section-title">Special Menu</h3>
                        <div className="row g-4">
                            {filteredSpecialMenus.map((item) => (
                                <div key={item.id} className="col-6">
                                    <div className="card product-card special-card h-100 p-3">
                                        <Link href={`/detail_product?id=${item.id}`} className="text-decoration-none">
                                            <div className="position-relative">
                                                <Image
                                                    src={`/${item.img}`}
                                                    alt={item.name}
                                                    width={150}
                                                    height={150}
                                                    className="card-img-top product-img w-100"
                                                />
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <span className="badge points-badge">+10 points</span>
                                                </div>
                                            </div>
                                            <div className="card-body p-0 mt-3">
                                                <h6 className="card-title">{item.name}</h6>
                                                <p className="card-text">Rp{item.price.toLocaleString("id-ID")}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn add-btn w-100 mt-3"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Extra Content for Better Scrolling */}
                <div className="extra-content container-main">
                    <div className="text-center">
                        <h4 className="section-title"> </h4>
                    </div>
                </div>
            </div>

            {/* Bottom Navbar */}
            <nav className="navbar fixed-bottom bg-white border-top shadow-lg">
                <div className="container-fluid px-1 py-1">
                    <div className="d-flex w-100 justify-content-around">
                        {/* Home Icon - Biru */}
                        <div className="d-flex flex-column align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-info mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="small text-info">Home</span>
                        </div>

                        {/* Cart Icon - Gray */}
                        <Link href="/payment" className="text-decoration-none">
                            <div className="d-flex flex-column align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="small text-muted">Cart</span>
                            </div>
                        </Link>

                        {/* History Icon - Gray */}
                        <Link href="/history" className="text-decoration-none">
                            <div className="d-flex flex-column align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-muted mb-1" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="small text-muted">History</span>
                            </div>
                        </Link>

                        {/* Profile Icon - Gray */}
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

            {/* Bootstrap JS */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
        </>
    );
}