import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  RatingStars                                                        */
/* ------------------------------------------------------------------ */

const sizeMap = {
  sm: "h-4 w-4",
  default: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;

const numericSizeMap = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} as const;

export interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value between 0 and 5 (supports halves, e.g. 3.5) */
  rating: number;
  /** Maximum number of stars */
  max?: number;
  /** Size variant */
  size?: keyof typeof sizeMap;
  /** Show the numeric rating text next to stars */
  showValue?: boolean;
  /** Color for filled stars */
  filledColor?: string;
  /** Color for empty stars */
  emptyColor?: string;
}

const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      className,
      rating,
      max = 5,
      size = "default",
      showValue = true,
      filledColor = "text-amber",
      emptyColor = "text-gray-300",
      ...props
    },
    ref
  ) => {
    const clamped = Math.max(0, Math.min(rating, max));
    const fullStars = Math.floor(clamped);
    const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75;
    const adjustedFull = clamped - fullStars >= 0.75 ? fullStars + 1 : fullStars;
    const emptyStars = max - adjustedFull - (hasHalf ? 1 : 0);

    const iconClass = sizeMap[size];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`Rating: ${clamped.toFixed(1)} out of ${max} stars`}
        {...props}
      >
        {/* Filled stars */}
        {Array.from({ length: adjustedFull }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(iconClass, filledColor, "fill-current")}
            aria-hidden="true"
          />
        ))}

        {/* Half star */}
        {hasHalf && (
          <span className={cn("relative inline-flex", iconClass)} aria-hidden="true">
            {/* Empty background star */}
            <Star className={cn("absolute inset-0", iconClass, emptyColor)} />
            {/* Half-filled overlay */}
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(iconClass, filledColor, "fill-current")} />
            </span>
          </span>
        )}

        {/* Empty stars */}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(iconClass, emptyColor)}
            aria-hidden="true"
          />
        ))}

        {/* Numeric value */}
        {showValue && (
          <span
            className={cn(
              "font-semibold text-gray-700 tabular-nums",
              "ltr:ml-1.5 rtl:mr-1.5",
              numericSizeMap[size]
            )}
          >
            {clamped.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);
RatingStars.displayName = "RatingStars";

export { RatingStars };
