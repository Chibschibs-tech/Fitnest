// This file is loaded dynamically on the client side
import React from "react"
import { createRoot } from "react-dom/client"
import { CartProvider } from "../contexts/cart-context"
import { CartContent } from "../app/cart/cart-content"

// Function to mount the cart component
export default function mountCart(container) {
  const root = createRoot(container)

  root.render(React.createElement(CartProvider, null, React.createElement(CartContent, null)))
}
