"use client"

import React, { ChangeEvent, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from './product-list';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/Cart';
import { toast } from "sonner"
import Link from 'next/link';
import { productSizes } from '@/types/data';


interface ProductState {
    qty: number | ""; // Quantity type
    size: typeof productSizes[number]; 
}


function ProductCard({ product }: { product: Product }) {
    const { data: session } = useSession()
    const [state, setState] = useState<ProductState>({ qty: "", size: '' });
    const dispatch = useDispatch()

    const handleSizeSelection = (selectedSize: typeof productSizes[number]) => {
        setState((prev) => ({ ...prev, size: selectedSize }));
    };

    const handleQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, qty: +e.target.value }));
    };

    const onSumbit = () => {
        if (!state.qty) return toast.error("Please enter the quantity of the product.");
        if (!state.size) return toast.error("Please select a size for the product.");

        const data = {
            _id: product._id,
            name: product.name,
            productNo: product.productNo,
            price: product.price,
            img: product.img,
            size: state.size,
            quantities: state.qty
        }
        console.log("Dispatching data:", data);
        dispatch(addToCart(data))
        toast.success(`${product.name} (${state.size}) has been added to your cart!`);
    }

    return (
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
                    <p className="text-sm font-medium text-gray-600">Available Sizes:</p>
                    <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
                        {Object.entries(product.quantities).map(([size, quantity]) => (
                            <div
                                key={size}
                                className="flex items-center p-1 border rounded-lg shadow-sm bg-gray-50 gap-1"
                            >
                                <span className="text-gray-700 font-medium">{size} : </span>
                                <strong className="text-lg text-gray-900"> {quantity}</strong>
                            </div>
                        ))}
                    </div>
                </div>


                <p className="mt-4 text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                </p>
            </CardContent>

            <CardFooter className="p-4 flex column flex-col gap-2 ">
                {session?.user.isAdmin ? (
                    <Link href={`/product/add?id=${product._id}`} className='w-full' >
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
                            Edit
                        </Button>
                    </Link>
                ) : (

                    <>
                        <div className="flex w-full gap-2 flex-col">
                            {/* size selection */}
                            <div className="w-full gap-3 items-center">
                                <p className="text-sm font-medium">Size:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {Object.keys(product.quantities).filter(e => product.quantities[e] > 0).map((size) => (
                                        <div
                                            key={size}
                                            className={`flex items-center justify-center  rounded-lg border text-sm font-medium cursor-pointer transition-all p-1 ${state.size === size
                                                    ? 'bg-green-100 text-green-700 border-green-500'
                                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                                }`}
                                            onClick={() => handleSizeSelection(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <input
                                type="number"
                                placeholder="Quantity"
                                className="w-full p-2 border rounded-lg"
                                value={state.qty}
                                onChange={handleQtyChange}
                            />
                        </div>

                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg" onClick={onSumbit} >
                            Add to Cart
                        </Button>
                    </>

                )}
            </CardFooter>
        </Card>
    )
}

export default ProductCard