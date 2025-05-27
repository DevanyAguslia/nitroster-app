// app/admin/logScreen/page.js
"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LogScreen() {
  const { user, isStaff, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (!isLoading && !isStaff) {
      router.push('/');
    }
  }, [isStaff, isLoading, router]);

  useEffect(() => {
    if (isStaff) {
      fetchAllOrders();
    }
  }, [isStaff]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentMethod = (order) => {
    // Default to showing payment method from order data or fallback
    return order.paymentMethod || 'QRIS';
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!isStaff) return <div className="flex justify-center items-center min-h-screen">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm">
        <button
          onClick={() => router.back()}
          className="mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Transaction Log</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="absolute right-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No transactions found for your search' : 'No transactions found'}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              {/* Date and Transaction ID Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    TX ID: {order.orderId}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm">
                    <span className="text-gray-600">Customer: </span>
                    <span className="font-medium text-gray-900">
                      {order.userEmail ? order.userEmail.split('@')[0] : 'Guest'}
                    </span>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-gray-600">Total: </span>
                    <span className="font-medium text-gray-900">
                      Rp{order.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Method: {getPaymentMethod(order)}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center mb-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                  Status: {order.status.toUpperCase()}
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-3">
                <div className="text-sm font-medium text-gray-900 mb-2">Items:</div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        - {item.name} (Rp{item.price.toLocaleString('id-ID')})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
        <Link href="/admin/dashboard">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1 text-gray-500">Home</span>
          </div>
        </Link>

        <Link href="/admin/orderScreen">
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

        <Link href="/admin/stockScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs mt-1 text-gray-500">Admin</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}