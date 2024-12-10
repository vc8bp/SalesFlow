import mongoose from 'mongoose';
import { productSizes } from "@/types/data"

const sizesModel = {}

productSizes.forEach(e => {
  sizesModel[e] = {
    type: Number,
    required: true,
    min: 0,
    default: 0, 
  }
})

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
    quantities: sizesModel,
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
