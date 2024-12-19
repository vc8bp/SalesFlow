"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, LogOut, Menu } from "lucide-react"
import CartComp from "@/components/cart/Cart"

export function Navbar() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">AssetManager</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {session?.user && (
              <div className="flex space-x-4">
                {!session?.user.isManager && <Link 
                  href="/products" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Products
                </Link>}
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

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user?.name}
                </span>
                {(!session.user.isAdmin || !session.user.isManager) && <CartComp />}
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

        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {session?.user && (
                <>
                  <Link 
                    href="/orders" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {session?.user?.isAdmin && (
                    <Link 
                      href="/admin" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
              {session ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    {session.user?.name}
                  </div>

                  {(!session.user.isAdmin || !session.user.isManager) && <CartComp />}
                  <button
                    onClick={() => signOut()}
                    className="w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
