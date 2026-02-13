/**
 * Cart Types
 * Defines the shape of cart items for the Express Shop cart system
 */

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}
