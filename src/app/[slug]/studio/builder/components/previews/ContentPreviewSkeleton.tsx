'use client';

import React from 'react';

interface ContentPreviewSkeletonProps {
    showGrid?: boolean;
    showText?: boolean;
    customContent?: React.ReactNode;
}

export function ContentPreviewSkeleton({
    showGrid = true,
    showText = true,
    customContent
}: ContentPreviewSkeletonProps) {
    if (customContent) {
        return <div className="space-y-4">{customContent}</div>;
    }

    return (
        <div className="space-y-4">
            {showGrid && (
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-zinc-800 rounded-lg"></div>
                    ))}
                </div>
            )}

            {showText && (
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                </div>
            )}
        </div>
    );
}
