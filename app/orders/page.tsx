"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Shadcn imports
import { Input } from '@/components/ui/input'; // Shadcn Input import
import Image from 'next/image';

// Define types for the data
interface Product {
  _id: string;
  productId: {
    _id: string;
    name: string;
    productNo: string;
    price: number;
    img: string;
    quantities: { [key: string]: number };
  };
  quantity: number;
  color: string;
}

interface Store {
  _id: string;
  name: string;
  email: string;
  number: string;
  address: string;
}

interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  createdBy: CreatedBy;
  storeId: Store;
  product: Product[];
  createdAt: string;
}

export default function OrderDetails() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetching order details from the API
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Filtering orders based on search term
  const filteredOrders = orders.filter((order) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      order.createdBy.name.toLowerCase().includes(lowerSearchTerm) ||
      order.createdBy.email.toLowerCase().includes(lowerSearchTerm) ||
      order.storeId.address.toLowerCase().includes(lowerSearchTerm) ||
      order.storeId.name.toLowerCase().includes(lowerSearchTerm) ||
      order.storeId.number.toLowerCase().includes(lowerSearchTerm) ||
      order.storeId.email.toLowerCase().includes(lowerSearchTerm) ||
  
      order.product.some((item) => 
        item.productId.name.toLowerCase().includes(lowerSearchTerm) ||
        item.productId.productNo.toLowerCase().includes(lowerSearchTerm) ||
        item.productId.price.toString().includes(lowerSearchTerm)  // Converting price to string for search
      )
    );
  });
  

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-800">Your Orders</h2>
        <Input
          type="text"
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-2 border rounded-md"
        />
      </div>

      {/* Orders Section */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order._id} className="flex flex-col space-y-6">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-800">Salesman: {order.createdBy.name}</h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Order Created:</span> {new Date(order.createdAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shop Details Section - Smaller Size */}
                <div className="space-y-2 md:col-span-1">
                  <h3 className="text-lg font-medium text-gray-700">Shop Details</h3>
                  <p className="text-gray-600"><span className="font-semibold">Name:</span> {order.storeId.name}</p>
                  <p className="text-gray-600"><span className="font-semibold">Email:</span> {order.storeId.email}</p>
                  <p className="text-gray-600"><span className="font-semibold">Phone:</span> {order.storeId.number}</p>
                  <p className="text-gray-600"><span className="font-semibold">Address:</span> {order.storeId.address}</p>
                </div>

                {/* Product Section - Larger Size */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700">Products Sold</h3>
                  {order.product.map((item) => (
                    <div key={item._id} className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-3">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.productId.img}
                          alt={item.productId.name}
                          width={200}
                          height={100}
                          className="object-cover rounded-md"
                        />
                        <div>
                          <p className="text-md font-semibold text-gray-800">{item.productId.name}</p>
                          <p className="text-sm text-gray-500">Product No: {item.productId.productNo}</p>

                          {/* Price Highlight */}
                          <p className="text-lg font-semibold text-gray-900">
                            <span className="text-green-600">₹{item.productId.price}</span>
                          </p>

                          {/* Quantity Highlight */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Quantity:</span>
                            <span className="font-bold text-indigo-600">{item.quantity}</span>
                          </div>

                          {/* Color Highlight */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Color:</span>
                            <div className={`w-[20px] h-[20px] bg-gray-${item.color == "dark" ? 900 : 300}  rounded-full`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No orders found.</p>
      )}
    </div>
  );
}
