export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
          <span className="text-gray-300">/</span>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <span className="text-gray-300">/</span>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="flex items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white p-8 lg:p-12">
            <div className="h-[400px] w-[300px] animate-pulse rounded-2xl bg-gray-100" />
          </div>

          {/* Details skeleton */}
          <div className="flex flex-col">
            {/* Title */}
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-gray-100" />

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            </div>

            {/* Price */}
            <div className="mt-6 h-8 w-28 animate-pulse rounded-lg bg-gray-200" />

            {/* Description */}
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>

            {/* Colors */}
            <div className="mt-8">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="mt-6">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-11 w-20 animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="mt-8">
              <div className="h-14 w-full animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
