import { Suspense } from 'react';
import { ProductList } from "@/components/products/product-list";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}