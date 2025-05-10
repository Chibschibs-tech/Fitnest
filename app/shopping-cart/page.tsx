import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | Fitnest.ma",
  description: "Review and manage items in your shopping cart.",
}

// This is a server component that doesn't use any client hooks
export default function ShoppingCartPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Your Cart</h1>
        <p className="mx-auto max-w-2xl text-gray-600">Review the items in your cart before checkout.</p>
      </div>

      {/* Client component will be mounted here */}
      <div id="cart-content"></div>

      {/* Cart script that will hydrate the cart content */}
      <CartScript />
    </div>
  )
}

// This component adds a script tag that will hydrate the cart content
function CartScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // This script runs only on the client side
          document.addEventListener('DOMContentLoaded', function() {
            const cartContentElement = document.getElementById('cart-content');
            
            // Create a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'flex items-center justify-center min-h-[40vh]';
            loadingElement.innerHTML = '<div class="animate-pulse text-center"><p class="text-lg">Loading cart...</p></div>';
            cartContentElement.appendChild(loadingElement);
            
            // Dynamically import the cart component
            import('/shopping-cart-client.js')
              .then(module => {
                // Remove loading indicator
                cartContentElement.innerHTML = '';
                
                // Mount the cart component
                module.default(cartContentElement);
              })
              .catch(error => {
                console.error('Error loading cart:', error);
                cartContentElement.innerHTML = '<div class="text-center text-red-500">Error loading cart. Please refresh the page.</div>';
              });
          });
        `,
      }}
    />
  )
}
