export default function SimpleExpressShop() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Express Shop</h1>
      <p className="text-center mb-8">This is a simplified version of the Express Shop to test deployment.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg p-4 shadow-sm">
            <div className="bg-gray-200 h-40 mb-4 rounded flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Product {item}</h2>
            <p className="text-gray-600 mb-4">This is a sample product description.</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">29.99 MAD</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
