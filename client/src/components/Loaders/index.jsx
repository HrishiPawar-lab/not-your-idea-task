const PageSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6 p-6">
            {/* Page title */}
            <div className="h-8 bg-gray-200 rounded w-1/3" />

            {/* Subheading / Filters */}
            <div className="h-5 bg-gray-200 rounded w-1/4" />

            {/* Cards / Table header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-28 bg-gray-200 rounded" />
                ))}
            </div>

            {/* Table skeleton */}
            <div className="space-y-3">
                {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, j) => (
                            <div
                                key={j}
                                className="h-4 bg-gray-200 rounded w-full"
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Form inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
            </div>

            {/* Button */}
            <div className="mt-4 h-10 w-32 bg-gray-300 rounded" />
        </div>
    );
};

export default PageSkeleton;
