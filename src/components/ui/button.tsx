"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none whitespace-nowrap",
    "min-h-[44px] min-w-[44px]", // touch target
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-sm hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-400",
        secondary:
          "bg-secondary text-white shadow-sm hover:bg-secondary-700 active:bg-secondary-800 focus-visible:ring-secondary-400",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-400",
        ghost:
          "text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-400",
        whatsapp:
          "bg-[#25D366] text-white shadow-sm hover:bg-[#1da851] active:bg-[#178a42] focus-visible:ring-[#25D366]/50",
        danger:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon element rendered before children */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after children */
  iconRight?: React.ReactNode;
  /** Renders as a child component (for composition) */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      iconLeft,
      iconRight,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : iconLeft ? (
          <span className="shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        ) : null}
        {children}
        {!loading && iconRight ? (
          <span className="shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        ) : null}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
