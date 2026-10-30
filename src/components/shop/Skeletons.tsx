/** Placeholders shaped like the real pages, so content lands where the eye already is. */

export function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex flex-col rounded-[26px] border border-edge bg-panel p-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="case relative aspect-[4/5] overflow-hidden rounded-[20px]">
        <div
          className="breathe absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 h-[55%] w-[55%] rounded-full bg-white/10 blur-3xl"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div className="skeleton absolute inset-x-[30%] inset-y-[18%] rounded-[22px] opacity-60" />
      </div>
      <div className="space-y-3 px-2.5 pb-2 pt-4">
        <div className="skeleton h-5 w-2/3 rounded-full" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-5 w-5 rounded-full" />
          ))}
        </div>
        <div className="skeleton h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <div className="skeleton h-[clamp(2.75rem,8vw,6.5rem)] w-3/4 max-w-xl rounded-3xl" />
      <div className="skeleton mt-4 h-4 w-24 rounded-full" />
      <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-[520px] rounded-[26px] border border-edge bg-panel p-5 lg:block">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mb-8 space-y-3">
              <div className="skeleton h-4 w-1/2 rounded-full" />
              <div className="flex flex-wrap gap-2">
                <div className="skeleton h-9 w-16 rounded-full" />
                <div className="skeleton h-9 w-20 rounded-full" />
                <div className="skeleton h-9 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} delay={i * 120} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div className="skeleton my-4 h-4 w-32 rounded-full" />
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div className="case relative aspect-square overflow-hidden rounded-[32px] sm:rounded-[40px]">
          <div className="breathe absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 h-[64%] w-[64%] rounded-full bg-brand/25 blur-[70px]" />
          <div className="skeleton absolute inset-x-[28%] inset-y-[14%] rounded-[36px] opacity-50" />
        </div>
        <div className="pb-10">
          <div className="skeleton h-[clamp(2.75rem,6vw,5.25rem)] w-4/5 rounded-3xl" />
          <div className="skeleton mt-5 h-5 w-2/3 rounded-full" />
          <div className="skeleton mt-8 h-9 w-36 rounded-full" />
          <div className="skeleton mt-8 h-4 w-28 rounded-full" />
          <div className="mt-3 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-9 w-9 rounded-full" />
            ))}
          </div>
          <div className="skeleton mt-8 h-4 w-24 rounded-full" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-[68px] rounded-2xl" />
            ))}
          </div>
          <div className="skeleton mt-8 h-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
