import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productNo: {
      type: String,
      required: true,
      unique: true,
    },
    quantities: {
      dark: {
        type: Number,
        required: true,
        min: 0,
        default: 0, // Ensure a default value
      },
      light: {
        type: Number,
        required: true,
        min: 0,
        default: 0, // Ensure a default value
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
