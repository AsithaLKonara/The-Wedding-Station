"use client";

interface LoadingSkeletonProps {
  variant?: "text" | "image" | "card" | "list";
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "text":
        return (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        );
      case "image":
        return (
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        );
      case "card":
        return (
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-4" />
            <div className="h-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        );
      case "list":
        return (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        );
      default:
        return <div className="h-20 bg-gray-200 rounded animate-pulse" />;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

