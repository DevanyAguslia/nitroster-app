"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '../contexts/AuthContext';
import '../globals.css';

export default function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isGuest } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (isGuest) return; // Early return untuk guest

    const fetchOrderHistory = async () => {
      try {
        const response = await fetch("/api/order-history", {
          credentials: 'include' // Tambahkan ini untuk mengirim cookies
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch order history");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [isGuest, router]);

  // === TAMPILAN UNTUK GUEST ===
  if (isGuest) {
    return (
      <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)' }}>
        {/* Header/Navbar */}
        <header className="bg-white py-4 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <button onClick={() => router.push("/home")} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-black">Order History</h1>
          </div>
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img src="/coffeeprofile.jpg" alt="Profile" className="h-full w-full object-cover" />
          </div>
        </header>

        {/* Main Content - Login Required Message */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Silahkan login untuk melihat order history Anda
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-cyan-600 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium inline-block transition-colors duration-200"
            >
              Login Now
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

          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1 text-blue-500">History</span>
          </div>

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

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Function to display status badge with appropriate color
  const StatusBadge = ({ status }) => {
    let bgColor = "";

    switch (status) {
      case "paid":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "pending":
        // Return link for pending status instead of badge
        return (
          <Link href="/thanks" className="px-3 py-2 text-xs font-medium rounded-full inline-block transition-all duration-300 hover:shadow-lg" style={{
            background: 'linear-gradient(135deg, #CEFF1A 0%, #B5E600 25%, #9CCC00 50%, #B5E600 75%, #CEFF1A 100%)',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(206, 255, 26, 0.4)',
            color: '#2d3748',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)'
          }}>
            Collect your order here
          </Link>
        );
      case "cancelled":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "delivered":
        bgColor = "bg-blue-100 text-blue-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)' }}>
      {/* Header/Navbar */}
      <header className="bg-white py-4 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button onClick={() => router.push("/")} className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-black">Order History</h1>
        </div>
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src="/coffeeprofile.jpg" alt="Profile" className="h-full w-full object-cover" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-4 h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No Orders Yet</h3>
            <p className="mt-2 text-gray-600">Your order history will appear here after you make a purchase.</p>
            <Link href="/home">
              <button className="mt-4 bg-cyan-600 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium inline-block mb-2 transition-colors duration-200">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="p-4 rounded-xl border border-gray-100"
                style={{
                  background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)',
                }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
                      <p className="text-base font-medium text-gray-900">{order.orderId}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={`${order.orderId}-${item.productId}`} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                      {/* Product Image */}
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
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
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="mt-1 text-xs text-blue-500">{item.description}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">Rp{item.price.toLocaleString('id-ID')}</p>
                            <p className="text-gray-500">x{item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">
                      Rp{order.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1 text-blue-500">History</span>
        </div>

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