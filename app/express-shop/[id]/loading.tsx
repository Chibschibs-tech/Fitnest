import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 inline-flex items-center text-sm text-gray-600">
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4" />
            <div className="mt-2 flex items-center">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-px w-full" />

          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div>
            <Skeleton className="mb-2 h-6 w-48" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4 flex items-center justify-center">
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
