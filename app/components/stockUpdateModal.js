'use client'

import { useState } from 'react'

export default function StockUpdateModal({ item, isOpen, onClose, onUpdate }) {
  const [amount, setAmount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (action) => {
    if (amount <= 0) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/stock/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, amount: parseInt(amount) }),
      })

      if (response.ok) {
        const data = await response.json()
        onUpdate(data.stock)
        onClose()
        setAmount(1)
      } else {
        alert('Error updating stock')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error updating stock')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Stock</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{item.image}</span>
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Current Stock: {item.stock}pcs</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (pieces)
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleUpdate('add')}
            disabled={isLoading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            Add Stock
          </button>
          <button
            onClick={() => handleUpdate('subtract')}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            Reduce Stock
          </button>
        </div>
      </div>
    </div>
  )
}