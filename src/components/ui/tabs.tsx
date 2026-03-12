"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Tab {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Tabs Context                                                       */
/* ------------------------------------------------------------------ */

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: "underline" | "pills";
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs />");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Tabs (root)                                                        */
/* ------------------------------------------------------------------ */

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Currently active tab value (controlled) */
  value?: string;
  /** Default active tab (uncontrolled) */
  defaultValue?: string;
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void;
  /** Visual variant */
  variant?: "underline" | "pills";
  children: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      variant = "underline",
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const activeTab = isControlled ? controlledValue : uncontrolled;

    const setActiveTab = React.useCallback(
      (val: string) => {
        if (!isControlled) setUncontrolled(val);
        onValueChange?.(val);
      },
      [isControlled, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

/* ------------------------------------------------------------------ */
/*  TabsList                                                           */
/* ------------------------------------------------------------------ */

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const { variant } = useTabsContext();

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "inline-flex items-center gap-1",
          variant === "underline" && "border-b border-gray-200 w-full",
          variant === "pills" && "bg-gray-100 p-1 rounded-lg",
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

/* ------------------------------------------------------------------ */
/*  TabsTrigger                                                        */
/* ------------------------------------------------------------------ */

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Value that identifies this tab */
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(value)}
        onKeyDown={(e) => {
          // Arrow key navigation
          const parent = (e.target as HTMLElement).parentElement;
          if (!parent) return;
          const tabs = Array.from(
            parent.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
          );
          const idx = tabs.indexOf(e.target as HTMLButtonElement);
          let nextIdx = idx;

          // Support both LTR and RTL arrow navigation
          const isRtl = getComputedStyle(parent).direction === "rtl";
          const nextKey = isRtl ? "ArrowLeft" : "ArrowRight";
          const prevKey = isRtl ? "ArrowRight" : "ArrowLeft";

          if (e.key === nextKey) {
            nextIdx = (idx + 1) % tabs.length;
          } else if (e.key === prevKey) {
            nextIdx = (idx - 1 + tabs.length) % tabs.length;
          } else if (e.key === "Home") {
            nextIdx = 0;
          } else if (e.key === "End") {
            nextIdx = tabs.length - 1;
          } else {
            return;
          }

          e.preventDefault();
          tabs[nextIdx].focus();
          setActiveTab(tabs[nextIdx].getAttribute("data-value") ?? "");
        }}
        data-value={value}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium",
          "transition-all duration-150 min-h-[44px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          // Underline variant
          variant === "underline" && [
            "border-b-2 -mb-px rounded-none",
            isActive
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          ],
          // Pills variant
          variant === "pills" && [
            "rounded-md",
            isActive
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

/* ------------------------------------------------------------------ */
/*  TabsContent                                                        */
/* ------------------------------------------------------------------ */

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value that identifies which tab this content belongs to */
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn("mt-4 animate-fade-in focus-visible:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
