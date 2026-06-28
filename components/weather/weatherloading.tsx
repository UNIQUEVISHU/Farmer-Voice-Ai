import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const WeatherLoading: React.FC = () => {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Current Weather Skeleton */}
      <Card className="w-full border-emerald-100">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900" />
            <Skeleton className="h-5 w-28 bg-emerald-100 dark:bg-emerald-900" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-11 w-24 bg-emerald-100 dark:bg-emerald-900" />
            <Skeleton className="h-4 w-40 bg-emerald-100 dark:bg-emerald-900" />
            <Skeleton className="h-3 w-24 bg-emerald-100 dark:bg-emerald-900" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-50 dark:border-emerald-900">
            <Skeleton className="h-16 rounded-xl bg-emerald-50 dark:bg-emerald-900/50" />
            <Skeleton className="h-16 rounded-xl bg-emerald-50 dark:bg-emerald-900/50" />
            <Skeleton className="h-16 rounded-xl bg-emerald-50 dark:bg-emerald-900/50" />
          </div>
        </CardContent>
      </Card>

      {/* Advice Grid Skeleton — mirrors the 1/3-column responsive advice layout */}
      <Card className="w-full border-emerald-100">
        <CardContent className="p-4 space-y-2.5">
          <Skeleton className="h-4 w-44 bg-emerald-100 dark:bg-emerald-900" />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-lg bg-emerald-50 dark:bg-emerald-900/50" />
            <Skeleton className="h-16 rounded-lg bg-emerald-50 dark:bg-emerald-900/50" />
            <Skeleton className="h-16 rounded-lg bg-emerald-50 dark:bg-emerald-900/50" />
          </div>
        </CardContent>
      </Card>

      {/* Forecast Row Skeleton — mirrors the 5-up compact forecast row */}
      <Card className="w-full border-emerald-100">
        <CardContent className="p-4 space-y-2.5">
          <Skeleton className="h-4 w-36 bg-emerald-100 dark:bg-emerald-900" />
          <div className="grid grid-cols-5 gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-emerald-50 dark:bg-emerald-900/50" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};