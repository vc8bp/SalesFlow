"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Product } from "@/components/products/product-list";

export default function CreateProductPage() {
  const searchQuery = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Single state to manage all form fields
  const [formData, setFormData] = useState({
    name: "",
    productNo: "",
    price: "",
    quantities: { dark: 0, light: 0 },
    image: null as File | null,
    imagePreview: null as string | null,
  });

  useEffect(() => {
    if (!searchQuery.get("id")) return;
    (async () => {
      try {
        const { data }: { data: Product } = await axios.get("/api/products", {
          params: { id: searchQuery.get("id") },
        });

        setFormData({
          name: data.name || "",
          productNo: data.productNo || "",
          price: data.price?.toString() || "",
          quantities: { dark: data.quantities.dark, light: data.quantities.light },
          image: null,
          imagePreview: data.img || null,
        });
      } catch (error: any | AxiosError) {
        if (error.response?.status === 404)
          toast.error(`No product found with this id : ${searchQuery.get("id")}`);
        else toast.error(error?.response?.data?.message || "Failed to Fetch Product!!!");
        router.push("/");
      }
    })();
  }, [searchQuery, router]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const formFields = [
    { label: "Product Name", id: "name", type: "text",  },
    { label: "Product Number", id: "productNo", type: "text", },
    { label: "Price", id: "price", type: "number" },
  ];

  const quantityFields = [
    {
      label: "Dark",
      id: "dark-quantity",
      type: "number",
      value: formData.quantities.dark,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({
          ...prev,
          quantities: { ...prev.quantities, dark: parseInt(e.target.value) || 0 },
        })),
    },
    {
      label: "Light",
      id: "light-quantity",
      type: "number",
      value: formData.quantities.light,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((prev) => ({
          ...prev,
          quantities: { ...prev.quantities, light: parseInt(e.target.value) || 0 },
        })),
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const isUpdateId = searchQuery.get("id")
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (formData.quantities.dark <= 0 && formData.quantities.light <= 0) {
      setLoading(false);
      setError("At least one color quantity is required.");
      return;
    }
  
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("productNo", formData.productNo);
    submitData.append("price", formData.price);
    submitData.append("id", isUpdateId)
    submitData.append("dark-quantity", formData.quantities.dark );
    submitData.append("light-quantity", formData.quantities.light);
    if (formData.image) submitData.append("image", formData.image);
  
    try {
      const { data } = await axios.post("/api/products", submitData, { headers: { "Content-Type": "multipart/form-data", }, });
      router.push("/");
      toast.success(data.message || `Product ${isUpdateId ? "Updated" : "Added"} Successfully!!!`)
    } catch (error: any | AxiosError) {
      console.log(error)
      setError(error.response?.data?.message || "Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id]}
                name={field.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                required
                className="w-full"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {formData.imagePreview ? (
                <Image
                  src={formData.imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              ) : (
                <p>Drag and drop an image here, or click to select one</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantities
            </label>
            <div className="grid grid-cols-2 gap-4">
              {quantityFields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
