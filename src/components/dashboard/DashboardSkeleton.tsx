
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * DashboardSkeleton
 * Displays skeletons for both cards (Booking Requests, Trip History, Recent Trip Requests).
 * Used during initial app/dashboard loading.
 */
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-center mb-8">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-52" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
    <div className="space-y-4 mt-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-28 mt-2" />
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
