import mongoose from 'mongoose';

// Define schema for order items
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
});

// Define schema for orders
const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // null untuk guest orders
  },
  userEmail: {
    type: String,
    required: false // untuk tracking guest orders
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'delivered'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'Midtrans'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create or use the existing model
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;