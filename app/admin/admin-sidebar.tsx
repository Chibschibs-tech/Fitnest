import Link from "next/link"
import { Settings, Database, Plus } from "lucide-react"

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</h3>
        <Link
          href="/admin/subscription-plans"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          Subscription Plans
        </Link>
        {/* rest of code here */}
      </div>
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Setup</h3>
        <Link
          href="/admin/create-subscription-tables"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <Database className="h-4 w-4" />
          Create Tables
        </Link>
        <Link
          href="/admin/init-subscription-plans"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
          Initialize Plans
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar
