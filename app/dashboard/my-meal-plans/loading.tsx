import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoadingMyMealPlans() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Loading your meal plans…</CardTitle>
          <CardDescription>This will only take a second.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-44 animate-pulse rounded-md bg-muted" />
            <div className="h-44 animate-pulse rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
