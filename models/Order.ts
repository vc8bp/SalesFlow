import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  total: { type: Number, default: 0},
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum : ['Pending', 'Conformed'],
    default: 'Pending'
  },
  remark: [
    {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      message: {
        type: String,
      },
      status: {
        type: String,
        enum : ['Pending', 'Conformed'],
        default: 'Pending'
      },
      time: {
        type: Date,
        default: Date.now,
      },
    }
  ]
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;