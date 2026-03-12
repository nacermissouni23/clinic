import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: "text" | "circle" | "rectangle";
  /** Width (CSS value). Defaults vary per variant. */
  width?: string | number;
  /** Height (CSS value). Defaults vary per variant. */
  height?: string | number;
  /** Number of text lines to render (only for variant="text") */
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "text",
      width,
      height,
      lines = 1,
      style,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
      "bg-[length:200%_100%] animate-shimmer",
      "rounded"
    );

    // Circle
    if (variant === "circle") {
      const size = width ?? height ?? 40;
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "rounded-full shrink-0", className)}
          style={{
            width: typeof size === "number" ? `${size}px` : size,
            height: typeof size === "number" ? `${size}px` : size,
            ...style,
          }}
          aria-hidden="true"
          {...props}
        />
      );
    }

    // Rectangle (e.g., image placeholder)
    if (variant === "rectangle") {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "rounded-lg", className)}
          style={{
            width: width
              ? typeof width === "number"
                ? `${width}px`
                : width
              : "100%",
            height: height
              ? typeof height === "number"
                ? `${height}px`
                : height
              : "200px",
            ...style,
          }}
          aria-hidden="true"
          {...props}
        />
      );
    }

    // Text lines (default)
    if (lines > 1) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col gap-2", className)}
          aria-hidden="true"
          {...props}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(baseClasses, "rounded-md")}
              style={{
                width:
                  i === lines - 1
                    ? "75%"
                    : width
                      ? typeof width === "number"
                        ? `${width}px`
                        : width
                      : "100%",
                height: height
                  ? typeof height === "number"
                    ? `${height}px`
                    : height
                  : "14px",
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, "rounded-md", className)}
        style={{
          width: width
            ? typeof width === "number"
              ? `${width}px`
              : width
            : "100%",
          height: height
            ? typeof height === "number"
              ? `${height}px`
              : height
            : "14px",
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
