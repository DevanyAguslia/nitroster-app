// app/admin/dashboard/page.js
"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'

export default function AdminDashboard() {
  const { user, logout, isStaff, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalSales: 0,
    popularProduct: '',
    popularProductCount: 0,
    todayOrders: 0,
    todaySales: 0,
    monthlyData: [],
    outOfStock: [],
    bestSellingProduct: ''
  });

  useEffect(() => {
    if (!isLoading && !isStaff) {
      router.push('/');
    }
  }, [isStaff, isLoading, router]);

  useEffect(() => {
    if (isStaff) {
      fetchDashboardData();
      // Set up interval untuk refresh data setiap 30 detik
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isStaff]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders data
      const ordersResponse = await fetch('/api/admin/orders');
      // Fetch stock data untuk out of stock items
      const stockResponse = await fetch('/api/admin/stock');

      if (ordersResponse.ok && stockResponse.ok) {
        const orders = await ordersResponse.json();
        const stockData = await stockResponse.json();

        // Calculate total orders this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        // Calculate today's orders
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order =>
          new Date(order.createdAt).toDateString() === today
        );

        // Calculate today's sales
        const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Calculate popular product
        const productCount = {};
        orders.forEach(order => {
          order.items.forEach(item => {
            if (productCount[item.name]) {
              productCount[item.name] += item.quantity;
            } else {
              productCount[item.name] = item.quantity;
            }
          });
        });

        const popularProduct = Object.keys(productCount).reduce((a, b) =>
          productCount[a] > productCount[b] ? a : b, ''
        );

        // Calculate monthly data for chart (last 30 days)
        const monthlyData = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayOrders = orders.filter(order =>
            new Date(order.createdAt).toDateString() === date.toDateString()
          );
          const dayTotal = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
          monthlyData.push(Math.floor(dayTotal / 1000)); // Convert to thousands
        }

        // Get real-time out of stock items dari stock data
        const outOfStockItems = stockData.stocks
          ? stockData.stocks.filter(item => item.stock === 0).map(item => item.name)
          : [];

        setDashboardData({
          totalOrders: monthlyOrders.length,
          totalSales: monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          popularProduct: popularProduct || 'No data',
          popularProductCount: productCount[popularProduct] || 0,
          todayOrders: todayOrders.length,
          todaySales: todaySales,
          monthlyData: monthlyData.length > 0 ? monthlyData : [0],
          outOfStock: outOfStockItems.length > 0 ? outOfStockItems : ['No items out of stock'],
          bestSellingProduct: popularProduct || 'No data'
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        totalOrders: 0,
        totalSales: 0,
        popularProduct: 'No data',
        popularProductCount: 0,
        todayOrders: 0,
        todaySales: 0,
        monthlyData: [0],
        outOfStock: ['Error loading stock data'],
        bestSellingProduct: 'No data'
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert("An error occurred during logout");
    }
  };

  // Simple line chart component - Updated with smaller points and proper spacing
  const SimpleLineChart = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const maxValue = Math.max(...data);
    const chartWidth = 100;
    const chartHeight = 100;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - (value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    // Calculate position for today's line (last data point)
    const todayPosition = chartWidth; // Right edge since today is the last point

    const getDateLabel = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - daysAgo));
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const getYAxisLabels = () => {
      const labels = [];
      const step = maxValue / 4; // 5 labels (0, 25%, 50%, 75%, 100%)
      for (let i = 4; i >= 0; i--) {
        const value = step * i;
        if (value >= 1000) {
          labels.push(`${Math.round(value / 1000)}k`);
        } else {
          labels.push(Math.round(value).toString());
        }
      }
      return labels;
    };

    const yAxisLabels = getYAxisLabels();

    return (
      <div className="flex justify-center w-full">
        <div className="bg-gray-200 rounded-lg p-4 relative w-full sm:w-[120%] md:w-[140%] lg:w-[160%] max-w-none">
          {/* Responsive height */}
          <div className="h-32 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Today's vertical line */}
              <line
                x1={todayPosition}
                y1="10"
                x2={todayPosition}
                y2="90"
                stroke="#EF4444"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                opacity="0.7"
                vectorEffect="non-scaling-stroke"
              />

              <polyline
                points={points}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
                className="drop-shadow-sm"
                vectorEffect="non-scaling-stroke"
              />
              {data.map((value, index) => {
                const x = (index / (data.length - 1)) * chartWidth;
                const y = chartHeight - (value / maxValue) * 80;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="0.4"
                    fill="#3B82F6"
                    className="drop-shadow-sm cursor-pointer transition-all duration-200"
                    vectorEffect="non-scaling-stroke"
                    onMouseEnter={() => setHoveredPoint({ index, value, x, y, date: getDateLabel(index) })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{
                      filter: hoveredPoint?.index === index ? 'drop-shadow(0 0 4px #3B82F6)' : '',
                      r: hoveredPoint?.index === index ? '0.8' : '0.4' // Slightly larger on hover
                    }}
                  />
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="font-semibold">{hoveredPoint.date}</div>
                <div>Rp{(hoveredPoint.value * 1000).toLocaleString('id-ID')}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>

          {/* Y-axis labels - positioned absolutely with dynamic values */}
          <div className="absolute top-4 left-2 text-gray-500 text-xs">{yAxisLabels[0]}</div>
          <div className="absolute top-1/4 left-2 text-gray-500 text-xs">{yAxisLabels[1]}</div>
          <div className="absolute top-1/2 left-2 text-gray-500 text-xs">{yAxisLabels[2]}</div>
          <div className="absolute top-3/4 left-2 text-gray-500 text-xs">{yAxisLabels[3]}</div>
          <div className="absolute bottom-4 left-2 text-gray-500 text-xs">{yAxisLabels[4]}</div>

          {/* Today label - responsive positioning */}
          <div className="absolute bottom-4 right-4 text-red-500 text-xs font-medium">Today</div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!isStaff) return <div className="flex justify-center items-center min-h-screen">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="mx-5 text-lg font-bold text-gray-900">STAFF DASHBOARD</h1>
          <div className="flex items-center space-x-2">
            {/* Real-time indicator */}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="px-4 py-6 bg-white">
        <div className="flex justify-center items-center">
          <Image
            src="/Nitroster Logo.jpg"
            alt="NITROSTER"
            width={120}
            height={40}
            className="w-auto h-auto"
          />
        </div>
      </div>

      {/* Best Selling Chart */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Best Selling this month: {dashboardData.bestSellingProduct}
          </h3>
          <SimpleLineChart data={dashboardData.monthlyData} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-200 rounded-lg p-4 text-center">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Total Orders</h4>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{dashboardData.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-gray-600">This Month</p>
          </div>

          <div className="bg-gray-200 rounded-lg p-4 text-center">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Sales</h4>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {dashboardData.totalSales > 0 ? `Rp${Math.floor(dashboardData.totalSales / 1000)}K` : 'XXX'}
            </p>
            <p className="text-xs text-gray-600">This Month</p>
          </div>

          <div className="bg-gray-200 rounded-lg p-4 text-center">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Popular</h4>
            <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 truncate">{dashboardData.popularProduct}</p>
            <p className="text-xs text-gray-600">{dashboardData.popularProductCount} orders</p>
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="px-4 py-2">
        <div className="bg-purple-400 rounded-lg p-4 text-white">
          <h3 className="text-lg font-bold mb-2">Today's Overview</h3>
          <p className="text-sm">
            Orders: {dashboardData.todayOrders} | Sales: {dashboardData.todaySales > 0 ? `Rp${Math.floor(dashboardData.todaySales / 1000)}K` : 'xxx'}
          </p>
        </div>
      </div>

      {/* Attention Required - Now with real-time stock data */}
      <div className="px-4 py-2">
        <div className={`rounded-lg p-4 text-white ${dashboardData.outOfStock.length > 0 && dashboardData.outOfStock[0] !== 'No items out of stock'
          ? 'bg-red-500'
          : 'bg-green-500'
          }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">
              {dashboardData.outOfStock.length > 0 && dashboardData.outOfStock[0] !== 'No items out of stock'
                ? 'Attention Required'
                : 'Stock Status Good'
              }
            </h3>
            <Link href="/admin/stockScreen">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:opacity-75 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p className="text-sm">
            {dashboardData.outOfStock.length > 0 && dashboardData.outOfStock[0] !== 'No items out of stock'
              ? `Out of Stock: ${dashboardData.outOfStock.join(', ')}`
              : 'All products are in stock'
            }
          </p>
          {dashboardData.outOfStock.length > 0 && dashboardData.outOfStock[0] !== 'No items out of stock' && (
            <p className="text-xs mt-1 opacity-90">
              {dashboardData.outOfStock.length} item{dashboardData.outOfStock.length > 1 ? 's' : ''} need restocking
            </p>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1 text-blue-500">Home</span>
        </div>

        <Link href="/admin/orderScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs mt-1 text-gray-500">Cart</span>
          </div>
        </Link>

        <Link href="/admin/logScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1 text-gray-500">History</span>
          </div>
        </Link>

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