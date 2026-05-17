
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* Vanilla HTML Skeleton elements with shimmer */}
      <div className="skeleton-image skeleton-shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-title skeleton-shimmer" />
        <div className="skeleton-text-container">
          <div className="skeleton-text long skeleton-shimmer" />
          <div className="skeleton-text medium skeleton-shimmer" />
          <div className="skeleton-text short skeleton-shimmer" />
        </div>
        <div className="skeleton-footer">
          <div className="skeleton-button skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function AdminSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-2xl skeleton-shimmer" style={{ minWidth: '48px' }} />
            <div className="space-y-2 flex-1 max-w-lg">
              <div className="h-5 skeleton-shimmer rounded-lg w-1/3" />
              <div className="flex items-center gap-3">
                <div className="h-3.5 skeleton-shimmer rounded w-16" />
                <div className="h-3.5 skeleton-shimmer rounded w-24" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
            <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
