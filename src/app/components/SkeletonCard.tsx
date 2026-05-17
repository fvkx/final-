import React from 'react';

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
