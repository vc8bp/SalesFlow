import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

function SingleOrder({ order, setSelectedOrder, setModalOpen }) {
    const { data: session } = useSession();
    const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);

    const latestRemark = order.remark?.[order.remark.length - 1] || null;

    return (
        <div key={order._id} className="flex flex-col space-y-6">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="flex flex-row flex-wrap items-center">
                    <div className="flex-grow">
                        <h2 className="text-2xl font-semibold text-gray-800">Salesman: {order.createdBy.name}</h2>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Order Created:</span> {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-3 ">
                            <span className="font-semibold">Status: </span>
                            <span className={`px-2 py-1 rounded text-white ${order.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                    <p className="text-2xl font-bold text-white bg-gray-800 rounded-md px-4 py-2 inline-block shadow-md border border-gray-600">
                        {order.total}
                    </p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-4 md:col-span-1">
                        <h3 className="text-lg font-medium text-gray-700">Shop Details</h3>
                        <div className="text-gray-600 space-y-2">
                            <p>
                                <span className="font-semibold">Name:</span> {order.storeId.name}
                            </p>
                            <p>
                                <span className="font-semibold">Email:</span> {order.storeId.email}
                            </p>
                            <p>
                                <span className="font-semibold">Phone:</span> {order.storeId.number}
                            </p>
                            <p>
                                <span className="font-semibold">Address:</span> {order.storeId.address}
                            </p>
                        </div>

                        {latestRemark && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Latest Remark</h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <p className="text-gray-800 mb-2">
                                        <span className="font-semibold">By:</span> {latestRemark.by.name}
                                    </p>
                                    <p className="text-gray-800 mb-2">
                                        <span className="font-semibold">Status:</span>
                                        <span
                                            className={`px-2 py-1 ml-2 rounded text-white ${latestRemark.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                        >
                                            {latestRemark.status}
                                        </span>
                                    </p>
                                    <div className="p-3 bg-blue-50 text-blue-900 font-medium rounded-lg border border-blue-200 mb-3">
                                        <p className="mt-1">{latestRemark.message}</p>
                                    </div>
                                    <p className="text-gray-800">
                                        <span className="font-semibold">Time:</span> {new Date(latestRemark.time).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}


                    </div>



                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-700">Products Sold</h3>
                        {order.product.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row items-center bg-gray-100 p-4 rounded-lg shadow-sm gap-4"
                            >
                                <Image
                                    src={item.productId.img}
                                    alt={item.productId.name}
                                    width={200}
                                    height={100}
                                    className="object-cover rounded-md"
                                />

                                <div className="flex-1 space-y-2">
                                    <p className="text-md font-semibold text-gray-800">{item.productId.name}</p>
                                    <p className="text-sm text-gray-500">Product No: {item.productId.productNo}</p>

                                    <p className="text-lg font-semibold text-gray-900">
                                        <span className="text-green-600">₹{item.productId.price}</span>
                                    </p>

                                    <span className="text-sm text-gray-500">Quantity:</span><br />
                                    <div className="flex items-center space-x-2 flex-wrap ">
                                        {Object.keys(item.quantity).map(size => (
                                            <>
                                                <span className="font-bold text-indigo-600">{size} : {item.quantity[size]}</span> <Separator orientation="vertical" color="black" />
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>


                <CardFooter className="flex justify-end items-center space-x-4">
                    <Button
                        onClick={() => setRemarksDialogOpen(true)}
                    >
                        View All Remarks
                    </Button>
                    {(session?.user.isManager || session?.user.isAdmin) && (
                        <Button
                            onClick={() => {
                                setSelectedOrder(order);
                                setModalOpen(true);
                            }}
                        >
                            Update Order Status
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={remarksDialogOpen} onOpenChange={setRemarksDialogOpen}>
                <DialogContent className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto ">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-gray-800">All Remarks</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {order.remark?.map((remark) => (
                            <div
                                key={remark._id}
                                className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200"
                            >
                                <p className="text-gray-800 mb-2">
                                    <span className="font-semibold">By:</span> {remark.by.name}
                                </p>
                                <p className="text-gray-800 mb-2">
                                    <span className="font-semibold">Status:</span>
                                    <span
                                        className={`px-3 py-1 ml-2 text-sm font-medium rounded ${remark.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                                            }`}
                                    >
                                        {remark.status}
                                    </span>
                                </p>
                                <div className="bg-blue-50 text-blue-900 font-medium rounded-md p-3 mb-3 border border-blue-200">
                                    <p className="mt-1">{remark.message}</p>
                                </div>
                                <p className="text-gray-800">
                                    <span className="font-semibold">Time:</span> {new Date(remark.time).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SingleOrder;
