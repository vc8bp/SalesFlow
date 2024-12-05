import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link href="/admin/create-salesman">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Salesman
          </Button>
        </Link>
      </div>

      {/* Add more admin features here */}
    </div>
  )
}