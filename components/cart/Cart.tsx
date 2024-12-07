import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBagIcon, TrashIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { update, remove, Cart } from "@/store/Cart"; 
import Image from "next/image";
import Checkout from "./Checkout";

export default function CartComp() {
  const cart = useSelector(({cart}: {cart: Array<Cart>}) => cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    const updatedItem = cart.find((item: Cart) => item._id === itemId);
    if (updatedItem) {
      const updatedCartItem = { ...updatedItem, quantities: quantity };
      dispatch(update(updatedCartItem));
    }
  };

  // Handle Delete Item
  const handleDelete = (itemId: string, color: string) => {
    dispatch(remove({ _id: itemId, color:  color}));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700">
          <ShoppingBagIcon className="h-4 w-4 mr-2" />
          Cart
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full min-w-[100%] max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <p className="text-sm text-gray-500">
            Review your items below and proceed to checkout.
          </p>
        </SheetHeader>

        <div className="py-4">
          <div className="grid grid-cols-1 gap-6">
            {cart.map((item : any, index: any) => (
              <div
                key={item._id + index}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex gap-2">Color: <div className={`w-[20px] h-[20px] bg-gray-${item.color == "dark" ? 900 : 300}  rounded-full`}></div></p>
                  <p className="text-sm text-gray-500">
                    Product No: {item.productNo}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleQuantityChange(item._id, item.quantities - 1)}
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantities}</span>
                  <button
                    className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleQuantityChange(item._id, item.quantities + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Delete Icon */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item._id, item.color)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Checkout>
            <Button variant="default" className="w-full">
              Proceed to Checkout
            </Button>
          </Checkout>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
