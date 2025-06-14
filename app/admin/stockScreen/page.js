'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import StockUpdateModal from '@/app/components/stockUpdateModal'
import AddItemModal from '@/app/components/addItemModal'

export default function StockScreen() {
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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

  const handleAddItem = (newItem) => {
    setInventory(prevInventory => [...prevInventory, newItem])
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
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #EADEEE 0%, #e8d5ec 25%, #dcc8e0 50%, #d4bdd8 75%, #EADEEE 100%)',
      paddingBottom: '100px'
    }}>
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
      <div className="container-fluid px-3 mb-3">
        <div className="rounded-3 p-3" style={{ background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)', boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span className="fs-1 fw-bold text-dark">{inventory.length}</span>
              <span className="text-muted ms-2">Product</span>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="ms-3 d-flex align-items-center justify-content-center"
                title="Add New Item"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#000000',
                  border: 'none',
                  outline: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: '25px',
                    lineHeight: '0.10',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </span>
              </button>

            </div>
            {inventory.length === 0 && (
              <button
                onClick={initializeData}
                className="btn btn-primary btn-sm"
              >
                Initialize Data
              </button>
            )}
          </div>

          {/* Stock Status Bar */}
          <div className="d-flex align-items-center mt-3">
            <div className="d-flex align-items-center me-4">
              <div className="bg-primary rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
              <span className="small text-muted">In Stock : {inStockCount}</span>
            </div>
            <div className="d-flex align-items-center">
              <div className="bg-danger rounded-circle me-2" style={{ width: '12px', height: '12px' }}></div>
              <span className="small text-muted">Out of Stock : {outOfStockCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="container-fluid px-3">
        <div className="row g-3">
          {filteredInventory.map((item) => (
            <div key={item.id} className="col-12 mb-2">
              <div
                className="rounded-3 p-3 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #f7f7ff 0%, #e8e8f0 25%, #d4d4e0 50%, #e8e8f0 75%, #f7f7ff 100%)',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleItemClick(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 12px 25px rgba(212, 212, 224, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(255,255,255,0.8), inset 0 -1px 3px rgba(0,0,0,0.1), 0 8px 20px rgba(212, 212, 224, 0.4)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="fs-1 me-3">{item.image}</div>
                    <div>
                      <div className="small text-muted">Product ID: {item.id}</div>
                      <div className="fw-medium text-dark">{item.name}</div>
                      <div className="small text-muted">
                        Stock: {item.stock}pcs - {item.status}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {item.stock > 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Update Modal */}
      <StockUpdateModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleStockUpdate}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
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
    </div >
  )
}