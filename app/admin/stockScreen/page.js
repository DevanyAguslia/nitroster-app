'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import StockUpdateModal from '@/app/components/stockUpdateModal'

export default function StockScreen() {
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch data dari database
  useEffect(() => {
    fetchStockData()
  }, [])

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/admin/stock')
      if (response.ok) {
        const data = await response.json()
        setInventory(data.stocks)
      } else {
        console.error('Failed to fetch stock data')
      }
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleStockUpdate = (updatedStock) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === updatedStock.id ? updatedStock : item
      )
    )
  }

  // Initialize data jika belum ada
  const initializeData = async () => {
    try {
      const response = await fetch('/api/admin/stock/initialize', {
        method: 'POST'
      })
      if (response.ok) {
        fetchStockData()
      }
    } catch (error) {
      console.error('Error initializing data:', error)
    }
  }

  // Filter inventory berdasarkan pencarian
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Hitung total produk berdasarkan status
  const inStockCount = inventory.filter(item => item.stock > 0).length
  const outOfStockCount = inventory.filter(item => item.stock === 0).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm">
        <Link href="/admin/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 ml-4">Inventory Overview</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-lg pl-10 pr-12 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>

      {/* Product Counter */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">{inventory.length}</span>
            <span className="text-gray-600 ml-2">Product</span>
            <div className="ml-4 bg-gray-900 text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          {inventory.length === 0 && (
            <button
              onClick={initializeData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Initialize Data
            </button>
          )}
        </div>

        {/* Stock Status Bar */}
        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">In Stock : {inStockCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Out of Stock : {outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="px-4 space-y-3">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">{item.image}</div>
              <div>
                <div className="text-sm text-gray-500">Product ID: {item.id}</div>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-600">
                  Stock: {item.stock}pcs - {item.status}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {item.stock > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stock Update Modal */}
      <StockUpdateModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleStockUpdate}
      />

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

        <Link href="/admin/logScreen">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1 text-gray-500">History</span>
          </div>
        </Link>

        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-xs mt-1 text-blue-500">Admin</span>
        </div>
      </nav>
    </div>
  )
}