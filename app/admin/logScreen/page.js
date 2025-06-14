"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LogScreen() {
  const { isStaff, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(''); // Now just stores month number (1-12)
  const [selectedYear, setSelectedYear] = useState('');

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
    let filtered = orders;

    // Filter by period first
    if (selectedPeriod !== 'all') {
      filtered = filterByPeriod(orders, selectedPeriod);
    }

    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, orders, selectedPeriod, selectedMonth, selectedYear]);

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

  const filterByPeriod = (orders, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);

      switch (period) {
        case 'today':
          const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
          return orderDay.getTime() === today.getTime();

        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return orderDate >= weekAgo && orderDate <= now;

        case 'month':
          if (selectedMonth) {
            // Filter by selected month in current year
            const currentYear = now.getFullYear();
            return orderDate.getFullYear() === currentYear &&
              orderDate.getMonth() === parseInt(selectedMonth) - 1;
          }
          // Filter for current month from the 1st day to now
          const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return orderDate >= firstDayOfCurrentMonth && orderDate <= now;

        case 'year':
          if (selectedYear) {
            return orderDate.getFullYear() === parseInt(selectedYear);
          }
          const yearAgo = new Date(today);
          yearAgo.setFullYear(today.getFullYear() - 1);
          return orderDate >= yearAgo && orderDate <= now;

        default:
          return true;
      }
    });
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
    return order.paymentMethod || 'QRIS';
  };

  const getPeriodText = (period) => {
    switch (period) {
      case 'today':
        return 'Hari Ini';
      case 'week':
        return 'Minggu Ini';
      case 'month':
        if (selectedMonth) {
          const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
          ];
          const currentYear = new Date().getFullYear();
          return `${monthNames[parseInt(selectedMonth) - 1]} ${currentYear}`;
        }
        return 'Bulan Ini';
      case 'year':
        return selectedYear ? `Tahun ${selectedYear}` : 'Tahun Ini';
      default:
        return 'Semua';
    }
  };

  // Simplified month options - just 12 months
  const getMonthOptions = () => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return monthNames.map((name, index) => ({
      value: (index + 1).toString(),
      label: name
    }));
  };

  const getYearOptions = () => {
    const options = [];
    for (let year = 2023; year <= 2050; year++) {
      options.push({ value: year.toString(), label: year.toString() });
    }
    return options;
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'month') {
      setSelectedMonth('');
    }
    if (period !== 'year') {
      setSelectedYear('');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!isStaff) return <div className="flex justify-center items-center min-h-screen">Access denied</div>;

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)'
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)'
        }}
      >
        <Link href="/admin/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 ml-4">Transaction Log</h1>
      </div>

      {/* Search Bar */}
      <div
        className="px-4 py-3"
        style={{
          background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)'
        }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800 placeholder-gray-500 border border-gray-300"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="absolute right-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div
        className="px-4 py-3 border-t border-gray-300"
        style={{
          background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)'
        }}
      >
        <div className="space-y-3">
          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm text-gray-700 whitespace-nowrap">Filter:</span>
            {['all', 'today', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${selectedPeriod === period
                  ? 'bg-gray-800 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
                  }`}
              >
                {period === 'month' ? 'Bulan' : period === 'year' ? 'Tahun' : getPeriodText(period)}
              </button>
            ))}
          </div>

          {/* Month Selector - Simplified */}
          {selectedPeriod === 'month' && (
            <div className="flex items-center space-x-2 bg-white/80 p-2 rounded border border-gray-300">
              <span className="text-sm text-gray-700 font-medium">Pilih Bulan:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-800 min-w-[120px]"
              >
                <option value="">Pilih Bulan</option>
                {getMonthOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Selector */}
          {selectedPeriod === 'year' && (
            <div className="flex items-center space-x-2 bg-white/80 p-2 rounded border border-gray-300">
              <span className="text-sm text-gray-700 font-medium">Pilih Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-800 min-w-[120px]"
              >
                <option value="">Pilih Tahun</option>
                {getYearOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-4 py-2">
        <div
          className="text-sm text-gray-800 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/40"
          style={{
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 12px rgba(58, 174, 216, 0.2)'
          }}
        >
          Menampilkan {filteredOrders.length} transaksi
          {selectedPeriod !== 'all' && ` untuk ${getPeriodText(selectedPeriod).toLowerCase()}`}
          {searchTerm && ` dengan kata kunci "${searchTerm}"`}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div
            className="text-center py-8 text-gray-700 rounded-lg border border-white/40"
            style={{
              background: 'linear-gradient(135deg, #3aaed8 0%, #2b9bc7 25%, #1e7a9e 50%, #2b9bc7 75%, #3aaed8 100%)',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 8px 20px rgba(58, 174, 216, 0.4)'
            }}
          >
            <span className="text-white">
              {searchTerm || selectedPeriod !== 'all'
                ? 'Tidak ada transaksi ditemukan untuk filter yang dipilih'
                : 'Tidak ada transaksi ditemukan'
              }
            </span>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-lg p-4 border border-white/40 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 25%, #7c3aed 50%, #9333ea 75%, #a855f7 100%)',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), 0 8px 20px rgba(168, 85, 247, 0.4)'
              }}
            >
              {/* Date and Transaction ID Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-medium text-white">
                    {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    TX ID: {order.orderId}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm">
                    <span className="text-white/80">Customer: </span>
                    <span className="font-medium text-white">
                      {order.userEmail ? order.userEmail.split('@')[0] : 'Guest'}
                    </span>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-white/80">Total: </span>
                    <span className="font-medium text-white">
                      Rp{order.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80">Method: {getPaymentMethod(order)}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center mb-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                  Status: {order.status.toUpperCase()}
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-white/30 pt-3">
                <div className="text-sm font-medium text-white mb-2">Items:</div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white/90">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1 text-gray-600">Home</span>
          </div>
        </Link>

        <Link href="/admin/orderScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs mt-1 text-gray-600">Cart</span>
          </div>
        </Link>

        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1 text-black">History</span>
        </div>

        <Link href="/admin/stockScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs mt-1 text-gray-600">Admin</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}