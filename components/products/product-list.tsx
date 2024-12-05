"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Filter, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "next-auth/react"

interface Product {
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
  const { data: session } = useSession()
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
  {filteredProducts.map((product) => (
    <Card key={product._id} className="hover:shadow-lg transition-shadow bg-white rounded-lg overflow-hidden">
      {/* Product Image */}
      <CardHeader className="p-0 overflow-hidden rounded-t-lg relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
          {product.productNo}
        </span>
      </CardHeader>

      {/* Product Details */}
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {new Date(product.createdAt).toLocaleDateString()}
        </CardDescription>

        <div className="mt-3">
          <p className="text-sm font-medium text-gray-600">Denim Quantities:</p>
          <div className="flex justify-between mt-1 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-900 rounded-full"></span>
              Dark: <strong>{product.quantities.dark}</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              Light: <strong>{product.quantities.light}</strong>
            </span>
          </div>
        </div>

        <p className="mt-4 text-lg font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      {/* Action Button */}
      <CardFooter className="p-4">
        {session?.user.isAdmin ? (
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
            Edit
          </Button>
        ) : (
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
            Create Order
          </Button>
        )}
      </CardFooter>
    </Card>
  ))}
</div>

    </div>
  )
}