"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Shadcn imports
import { Input } from '@/components/ui/input'; // Shadcn Input import
import { Button } from '@/components/ui/button'; // Shadcn Button import
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog'; // Shadcn Dialog import
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import SingleOrder from "./SingleOrder"
import { toast } from 'sonner';

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
  size: string;
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
  total: number;
  status: string;
}

export default function OrderDetails() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: session } = useSession()
  const [formData, setFormData] = useState({message: "", status: "Pending"})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const {data} = await axios.get('/api/orders');

        const transformedOrders = data.map((order) => {
          const groupedProducts = {};

          order.product.forEach(({ productId, size, quantity }) => {
            const id = productId._id;
            if (!groupedProducts[id]) groupedProducts[id] = { productId, quantity: {} };
            groupedProducts[id].quantity[size] = quantity;
          });

          const products = Object.values(groupedProducts);

          return { ...order, product: products };
        });
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);


  console.log({orders})
  const handleUpdateStatus = async () => {
    console.log({ selectedOrder, ...formData });
  
    if (!selectedOrder || !formData.message || !formData.status) {
      toast.error('Status and message are required.');
      return;
    }
  
    try {
      setLoading(true);
      const { data } = await axios.put('/api/orders', {  ...formData,  orderId: selectedOrder._id  });
  
      setOrders((prevOrders) => prevOrders.map((order) => order._id === selectedOrder._id  ? { ...order, status: formData.status }  : order));
  
      toast.success('Order status updated successfully!');
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
      setSelectedOrder(null);
    }
  };
  

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
        item.productId.price.toString().includes(lowerSearchTerm) // Converting price to string for search
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

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => <SingleOrder order={order} setSelectedOrder={setSelectedOrder} setModalOpen={setModalOpen} />)
      ) : (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      {(session?.user.isManager || session?.user.isAdmin) && <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={formData.status} onValueChange={(value) => setFormData(p => ({...p, status: value}))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Conformed">Conformed</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Enter a message"
              value={formData.message}
              onChange={(e) => setFormData(p => ({...p, message: e.target.value}))}
              className="w-full"
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={loading}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
    </div>
  );
}
