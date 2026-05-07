const SkeletonCard = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="card p-0 overflow-hidden flex flex-col h-full animate-fade-in"
        >
          {/* Image Skeleton */}
          <div className="h-40 bg-secondary-200 animate-shimmer" />

          {/* Content Skeleton */}
          <div className="flex-1 p-md flex flex-col gap-md">
            {/* Name skeleton */}
            <div className="space-y-md">
              <div className="h-4 bg-secondary-200 animate-shimmer rounded-md w-3/4" />
              <div className="h-3 bg-secondary-200 animate-shimmer rounded-md w-1/2" />
            </div>

            {/* Price skeleton */}
            <div className="h-5 bg-secondary-200 animate-shimmer rounded-md w-1/3 mt-auto mb-md" />

            {/* Button skeleton */}
            <div className="h-10 bg-secondary-200 animate-shimmer rounded-md w-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
