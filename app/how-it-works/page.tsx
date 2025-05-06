const HowItWorksPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">How Fitnest Works</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1 */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Step 1: Sign Up</h2>
          <p className="text-gray-700">
            Create your Fitnest account by providing your basic information and fitness goals.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Step 2: Personalize Your Profile</h2>
          <p className="text-gray-700">
            Tell us more about your fitness level, preferences, and any dietary restrictions. This helps us tailor the
            experience to you.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Step 3: Explore Workouts & Plans</h2>
          <p className="text-gray-700">
            Browse our extensive library of workouts and training plans designed by certified fitness professionals.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Step 4: Track Your Progress</h2>
          <p className="text-gray-700">
            Monitor your progress, track your workouts, and celebrate your achievements. Stay motivated and reach your
            goals!
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Ready to get started?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Join Fitnest today!
          </a>
        </p>
      </div>
    </div>
  )
}

export default HowItWorksPage
