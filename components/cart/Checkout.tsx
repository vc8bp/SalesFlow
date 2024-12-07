"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Cart, clearCart } from "@/store/Cart";

export default function Checkout({ children }: { children: any }) {
  const cart = useSelector(({ cart }: { cart: Array<Cart> }) => cart);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    number: "",
    email: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (name: string) => {
    setLoading(true);
    setNotFound(false);
    setSearchResults([]);

    try {
      const { data } = await axios.get(`/api/store?name=${name}`);
      if (data.length) {
        setSearchResults(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setFormData(customer);
    setSearchResults([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/store", { store: formData, cart });
      toast.success(data.message || "Checkout details saved successfully!");
      dispatch(clearCart());
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving customer data:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger onClick={() => setIsOpen(true)}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Fill in the details below to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 relative">
          {/* Name Field with Search */}
          <div className="relative">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => {
                handleChange(e);
                handleSearch(e.target.value);
              }}
            />
            {loading && <p className="absolute top-full left-0 mt-1 text-sm text-gray-500">Searching...</p>}
            {notFound && <p className="absolute top-full left-0 mt-1 text-sm text-red-500">No customer found.</p>}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border mt-1 max-h-60 overflow-auto z-10 shadow-lg">
                {searchResults.map((customer: any) => (
                  <p
                    key={customer.id}
                    className="cursor-pointer px-4 py-2 text-blue-500 hover:bg-gray-100"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    {customer.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <Input
            type="text"
            name="number"
            placeholder="Contact Number"
            value={formData.number}
            onChange={handleChange}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </form>

        <Button variant="default" className="mt-4 w-full" onClick={handleSubmit}>
          Confirm Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
