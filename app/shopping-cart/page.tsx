import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | Fitnest.ma",
  description: "Review and manage items in your shopping cart.",
}

// This is a simple server component that doesn't use any client hooks
export default function ShoppingCartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Your Cart</h1>
        <p className="mx-auto max-w-2xl text-gray-600">Review the items in your cart before checkout.</p>
      </div>

      {/* Client component will be mounted here */}
      <div id="cart-content" className="min-h-[60vh]">
        <div className="flex h-60 items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-lg">Loading your cart...</p>
          </div>
        </div>
      </div>

      {/* Client-side script to render the cart */}
      <CartScript />
    </div>
  )
}

// This component adds a script tag that will render the cart on the client side
function CartScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Wait for the DOM to be fully loaded
          document.addEventListener('DOMContentLoaded', function() {
            // Get the cart content element
            const cartContent = document.getElementById('cart-content');
            
            // Function to load the cart
            function loadCart() {
              // Show loading state
              cartContent.innerHTML = '<div class="flex h-60 items-center justify-center"><div class="animate-pulse text-center"><p class="text-lg">Loading your cart...</p></div></div>';
              
              // Fetch the cart data
              fetch('/api/cart')
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to fetch cart');
                  }
                  return response.json();
                })
                .then(data => {
                  if (!data.items || data.items.length === 0) {
                    // Empty cart
                    cartContent.innerHTML = \`
                      <div class="flex flex-col items-center justify-center space-y-6 rounded-lg border border-dashed p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-gray-300">
                          <circle cx="8" cy="21" r="1"></circle>
                          <circle cx="19" cy="21" r="1"></circle>
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                        </svg>
                        <div>
                          <h2 class="text-xl font-medium">Your cart is empty</h2>
                          <p class="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
                        </div>
                        <a href="/express-shop" class="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                          Browse Products
                        </a>
                      </div>
                    \`;
                  } else {
                    // Render cart items
                    let itemsHtml = '';
                    data.items.forEach(item => {
                      const price = item.product.salePrice || item.product.price;
                      itemsHtml += \`
                        <div class="py-6 first:pt-0 last:pb-0 border-b">
                          <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100 sm:h-32 sm:w-32">
                              <img src="\${item.product.imageUrl || '/placeholder.svg'}" alt="\${item.product.name}" class="h-full w-full object-cover">
                            </div>
                            <div class="flex flex-1 flex-col">
                              <div class="flex justify-between">
                                <div>
                                  <h3 class="text-lg font-medium">\${item.product.name}</h3>
                                  <p class="mt-1 text-sm text-gray-500">Category: \${item.product.category}</p>
                                </div>
                                <div class="text-right">
                                  \${item.product.salePrice ? 
                                    \`<p class="text-lg font-medium text-green-600">\${item.product.salePrice} MAD</p>
                                     <p class="text-sm text-gray-500 line-through">\${item.product.price} MAD</p>\` : 
                                    \`<p class="text-lg font-medium">\${item.product.price} MAD</p>\`
                                  }
                                </div>
                              </div>
                              <div class="mt-4 flex flex-1 items-end justify-between">
                                <div class="flex items-center space-x-2">
                                  <div class="flex items-center rounded-md border">
                                    <button 
                                      class="h-8 w-8 rounded-none border-r" 
                                      onclick="updateQuantity(\${item.id}, \${item.quantity - 1})"
                                      \${item.quantity <= 1 ? 'disabled' : ''}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"></path>
                                      </svg>
                                    </button>
                                    <span class="w-10 text-center text-sm">\${item.quantity}</span>
                                    <button 
                                      class="h-8 w-8 rounded-none border-l" 
                                      onclick="updateQuantity(\${item.id}, \${item.quantity + 1})"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 5v14"></path>
                                        <path d="M5 12h14"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <button 
                                  class="text-red-500 text-sm flex items-center" 
                                  onclick="removeItem(\${item.id})"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      \`;
                    });
                    
                    // Render the cart
                    cartContent.innerHTML = \`
                      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div class="lg:col-span-2">
                          <div class="rounded-lg border shadow-sm p-6">
                            <h2 class="text-xl font-semibold mb-4">Cart Items (\${data.items.length})</h2>
                            <div class="divide-y">
                              \${itemsHtml}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="rounded-lg border shadow-sm p-6 sticky top-20">
                            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
                            <div class="space-y-4">
                              <div class="flex justify-between">
                                <span>Subtotal</span>
                                <span>\${data.subtotal} MAD</span>
                              </div>
                              <div class="flex justify-between">
                                <span>Shipping</span>
                                <span class="text-green-600">Free</span>
                              </div>
                              <div class="border-t pt-4 mt-4">
                                <div class="flex justify-between text-lg font-bold">
                                  <span>Total</span>
                                  <span>\${data.subtotal} MAD</span>
                                </div>
                              </div>
                              <a href="/checkout" class="mt-6 inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                                Checkout
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="ml-2">
                                  <path d="M5 12h14"></path>
                                  <path d="m12 5 7 7-7 7"></path>
                                </svg>
                              </a>
                              <a href="/express-shop" class="mt-2 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                Continue Shopping
                              </a>
                              <div class="mt-4 text-center text-sm text-gray-500">
                                <p>Need help? Contact our support team</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    \`;
                  }
                })
                .catch(error => {
                  console.error('Error loading cart:', error);
                  cartContent.innerHTML = '<div class="text-center text-red-500 p-8">Error loading cart. Please refresh the page.</div>';
                });
            }
            
            // Function to update quantity
            window.updateQuantity = function(itemId, quantity) {
              if (quantity < 1) return;
              
              fetch('/api/cart', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity }),
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to update cart');
                  }
                  loadCart();
                })
                .catch(error => {
                  console.error('Error updating cart:', error);
                  alert('Failed to update cart. Please try again.');
                });
            };
            
            // Function to remove item
            window.removeItem = function(itemId) {
              fetch(\`/api/cart?id=\${itemId}\`, {
                method: 'DELETE',
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to remove item from cart');
                  }
                  loadCart();
                })
                .catch(error => {
                  console.error('Error removing item from cart:', error);
                  alert('Failed to remove item from cart. Please try again.');
                });
            };
            
            // Load the cart
            loadCart();
          });
        `,
      }}
    />
  )
}
