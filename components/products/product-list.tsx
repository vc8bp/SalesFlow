"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Filter, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"; 
import { useSession } from "next-auth/react"
import ProductCard from "./productCard"

export interface Product {
  _id: string;
  name: string;
  productNo: string;
  quantities: {
    dark: number;
    light: number;
  };
  price: number;
  img: string;
  createdAt: string;
  updatedAt: string;
}


export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.productNo.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Products</h1>
          <Link href="/product/add">
            <Button>
              <FilePlus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => <ProductCard product={product} /> )}
      </div>
    </div>
  )
}