"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"

interface Snack {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  active: boolean
  created_at: string
}

export default function SnacksContent() {
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchSnacks()
  }, [])

  const fetchSnacks = async () => {
    try {
      const response = await fetch("/api/admin/products/snacks")
      const data = await response.json()
      if (data.success) {
        setSnacks(data.snacks || [])
      }
    } catch (error) {
      console.error("Error fetching snacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSnacks = snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snack.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitnest-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Snacks & Supplements</h1>
          <p className="text-gray-600">Manage protein bars, supplements, and healthy snacks</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-fitnest-green hover:bg-fitnest-green/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Snack
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search snacks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-fitnest-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Snacks</p>
                <p className="text-2xl font-bold">{snacks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{snacks.filter((s) => s.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{snacks.filter((s) => s.stock < 10).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(snacks.map((s) => s.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Snacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSnacks.map((snack) => (
          <Card key={snack.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{snack.name}</CardTitle>
                <Badge variant={snack.active ? "default" : "secondary"}>{snack.active ? "Active" : "Inactive"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{snack.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="font-semibold">{snack.price} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm">{snack.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className={`text-sm ${snack.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                    {snack.stock} units
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSnacks.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No snacks found</h3>
          <p className="text-gray-600">Get started by adding your first snack product.</p>
        </div>
      )}
    </div>
  )
}
