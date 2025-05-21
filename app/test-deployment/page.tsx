export default function TestDeploymentPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Deployment Test Page</h1>
      <p>If you can see this page, the deployment was successful!</p>
      <p className="mt-4">Current time: {new Date().toISOString()}</p>
    </div>
  )
}
