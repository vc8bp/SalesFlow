"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quantities, setQuantities] = useState({ dark: 0, light: 0 });

  const fields = [
    { id: "name", label: "Product Name", type: "text", required: true },
    { id: "productNo", label: "Product Number", type: "text", required: true },
    { id: "price", label: "Price", type: "number", required: true, min: 0 },
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    fields.forEach((field) => {
      formData.append(field.id, formData.get(field.id) as string);
    });

    if (image) {
      formData.append("image", image);
    }

    // Validate quantities
    if (quantities.dark <= 0 && quantities.light <= 0) {
      setLoading(false);
      setError("At least one color quantity is required.");
      return;
    }

    formData.append("quantity", JSON.stringify(quantities));

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json();
        return setError(body.error || "Failed to create product. Please try again.");
      }

      router.push("/");
    } catch (error) {
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                name={field.id}
                type={field.type}
                required={field.required}
                {...(field.min !== undefined ? { min: field.min } : {})}
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
              {imagePreview ? (
                <Image
                  src={imagePreview}
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
              <div>
                <label
                  htmlFor="dark-quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dark
                </label>
                <Input
                  id="dark-quantity"
                  name="dark-quantity"
                  type="number"
                  min={0}
                  value={quantities.dark}
                  onChange={(e) =>
                    setQuantities({ ...quantities, dark: parseInt(e.target.value) || 0 })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="light-quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Light
                </label>
                <Input
                  id="light-quantity"
                  name="light-quantity"
                  type="number"
                  min={0}
                  value={quantities.light}
                  onChange={(e) =>
                    setQuantities({ ...quantities, light: parseInt(e.target.value) || 0 })
                  }
                  className="w-full"
                />
              </div>
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
