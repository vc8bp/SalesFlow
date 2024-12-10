"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, LogOut } from "lucide-react"
import CartComp from "@/components/cart/Cart"


export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">AssetManager</span>
            </Link>

            {session?.user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link 
                  href="/products" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Products
                </Link>
                <Link 
                  href="/orders" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Orders
                </Link>
                {session?.user?.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
            
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user?.name}
                </span>
                <CartComp/>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-gray-700 ml-0"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}