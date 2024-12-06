"use client"

import React, { ChangeEvent, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from './product-list';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/Cart';

interface ProductState {
    qty: number | ""; // Quantity type
    color: 'dark' | 'light' | ''; // Union type for color
}


function ProductCard({ product }: { product: Product }) {
    const { data: session } = useSession()
    const [state, setState] = useState<ProductState>({ qty: "", color: '' });
    const dispatch = useDispatch()

    const handleColorSelection = (selectedColor: 'dark' | 'light') => {
        setState((prev) => ({ ...prev, color: selectedColor }));
    };

    const handleQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, qty: +e.target.value }));
    };

    const onSumbit = () => {
        console.log("Called")
        const data = {
            _id: product._id,
            name: product.name,
            productNo: product.productNo,
            price: product.price,
            img: product.img,
            color: state.color,
            quantities: state.qty
        } 
        console.log("Dispatching data:", data);
        dispatch(addToCart(data))
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

            <CardFooter className="p-4 flex column flex-col gap-2 ">
                {session?.user.isAdmin ? (
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
                        Edit
                    </Button>
                ) : (

                    <>
                        <div className="flex w-full gap-2">
                            {/* Color selection */}
                            <div className="w-full flex gap-1 items-center">
                                <p>Color :</p>
                                <div
                                    className={`w-[30px] h-[30px] bg-gray-900 rounded-full cursor-pointer ${state.color === 'dark' ? 'ring-2 ring-green-500' : ''}`}
                                    onClick={() => handleColorSelection('dark')}
                                ></div>
                                <div
                                    className={`w-[30px] h-[30px] bg-gray-300 rounded-full cursor-pointer ${state.color === 'light' ? 'ring-2 ring-green-500' : ''}`}
                                    onClick={() => handleColorSelection('light')}
                                ></div>
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