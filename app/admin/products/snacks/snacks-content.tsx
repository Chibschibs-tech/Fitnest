"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface Snack {
  id: number
  name: string
  description: string
  calories: number
  price: number
  category: string
  ingredients: string[]
  allergens: string[]
  image_url?: string
  is_available: boolean
  stock_quantity?: number
}

export function SnacksContent() {
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSnacks()
  }, [])

  const fetchSnacks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products/snacks")
      if (!response.ok) {
        throw new Error("Failed to fetch snacks")
      }
      const data = await response.json()
      setSnacks(data.snacks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch snacks")
    } finally {
      setLoading(false)
    }
  }

  const filteredSnacks = snacks.filter(
    (snack) =>
      snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snack.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Snack Management</h1>
          <p className="text-gray-600">Manage your snack offerings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Snack
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search snacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Snacks ({filteredSnacks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSnacks.map((snack) => (
                <TableRow key={snack.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                      <Image
                        src={snack.image_url || "/placeholder.svg?height=48&width=48"}
                        alt={snack.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{snack.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{snack.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{snack.category}</Badge>
                  </TableCell>
                  <TableCell>{snack.calories} cal</TableCell>
                  <TableCell>{snack.price} MAD</TableCell>
                  <TableCell>{snack.stock_quantity !== undefined ? `${snack.stock_quantity} units` : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={snack.is_available ? "default" : "secondary"}>
                      {snack.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSnacks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No snacks found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
