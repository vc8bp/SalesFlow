"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateSalesmanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState("") 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      number: formData.get("number"),
      role: role
    }

    try {
      const response = await fetch("/api/admin/salesmen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create salesman")
      }

      router.push("/admin")
      // router.refresh()
    } catch (error) {
      setError("Failed to create salesman. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Salesman Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select 
              name="role" 
              value={role} // Controlled value
              onValueChange={setRole} // Update state on change
            >
              <SelectTrigger id="role"  className="w-full">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isSalesman">Salesman</SelectItem>
                <SelectItem value="isManager">Manager</SelectItem>
                <SelectItem value="isAdmin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              id="number"
              name="number"
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Salesman"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
