import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Virtual field untuk status
StockSchema.virtual('status').get(function () {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock < 5) return 'Low Stock';
  return 'In Stock';
});

// Ensure virtual fields are serialized
StockSchema.set('toJSON', { virtuals: true });
StockSchema.set('toObject', { virtuals: true });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);