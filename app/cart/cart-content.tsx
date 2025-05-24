import type React from "react"
import type { CartItem } from "@/types"
import NewCartActions from "./new-cart-actions"

interface CartContentProps {
  cartItems: CartItem[]
}

const CartContent: React.FC<CartContentProps> = ({ cartItems }) => {
  if (!cartItems || cartItems.length === 0) {
    return <p>Your cart is empty.</p>
  }

  return (
    <ul>
      {cartItems.map((item) => (
        <li key={item.id}>
          {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
          <NewCartActions item={item} />
        </li>
      ))}
    </ul>
  )
}

export default CartContent
