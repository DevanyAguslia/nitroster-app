// app/components/addItemModal.js
'use client'

import { useState } from 'react'

// Daftar emoticon yang tersedia untuk dipilih
const availableEmojis = [
  '☕', '🍵', '🥛', '🥫', '🌿', '🍰', '🧁', '🍪', '🥤', '🧊',
  '🍯', '🥜', '🍫', '🍬', '🧈', '🥥', '🍋', '🍊', '🍓', '🫐',
  '🥨', '🍞', '🥖', '🧀', '🥓', '🥞', '🍳', '🥪', '🌭', '🍕'
]

export default function AddItemModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    stock: 0,
    image: '☕'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.id || !formData.name) {
      alert('Product ID and Name are required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        onAdd(data.stock)
        onClose()
        // Reset form
        setFormData({
          id: '',
          name: '',
          stock: 0,
          image: '☕'
        })
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }))
  }

  const selectEmoji = (emoji) => {
    setFormData(prev => ({ ...prev, image: emoji }))
    setShowEmojiPicker(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID *
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              placeholder="e.g., INO006"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Organic Green Tea"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Initial Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Stock (pieces)
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{formData.image}</span>
                  <span className="text-gray-600">Click to change icon</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showEmojiPicker && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-6 gap-2 p-3">
                    {availableEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectEmoji(emoji)}
                        className="text-2xl p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="flex items-center">
              <span className="text-2xl mr-3">{formData.image}</span>
              <div>
                <p className="font-medium">{formData.name || 'Product Name'}</p>
                <p className="text-sm text-gray-500">ID: {formData.id || 'Product ID'}</p>
                <p className="text-sm text-gray-500">Stock: {formData.stock}pcs</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}