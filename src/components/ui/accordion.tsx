"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Accordion Context                                                  */
/* ------------------------------------------------------------------ */

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within <Accordion />");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Accordion (root)                                                   */
/* ------------------------------------------------------------------ */

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open simultaneously */
  type?: "single" | "multiple";
  /** Default open item value(s) */
  defaultValue?: string | string[];
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", defaultValue, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
      if (!defaultValue) return new Set();
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    });

    const toggle = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          const next = new Set(prev);
          if (next.has(value)) {
            next.delete(value);
          } else {
            if (type === "single") {
              next.clear();
            }
            next.add(value);
          }
          return next;
        });
      },
      [type]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggle }}>
        <div
          ref={ref}
          className={cn("divide-y divide-gray-200", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

/* ------------------------------------------------------------------ */
/*  AccordionItem                                                      */
/* ------------------------------------------------------------------ */

const AccordionItemContext = React.createContext<string>("");

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique value for this item */
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => (
    <AccordionItemContext.Provider value={value}>
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
);
AccordionItem.displayName = "AccordionItem";

/* ------------------------------------------------------------------ */
/*  AccordionTrigger                                                   */
/* ------------------------------------------------------------------ */

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems, toggle } = useAccordionContext();
    const value = React.useContext(AccordionItemContext);
    const isOpen = openItems.has(value);

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          onClick={() => toggle(value)}
          aria-expanded={isOpen}
          className={cn(
            "flex flex-1 items-center justify-between py-4 text-start",
            "text-base font-medium text-gray-900",
            "transition-colors hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 rounded-sm",
            "min-h-[44px]",
            className
          )}
          {...props}
        >
          {children}
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200",
              "ltr:ml-2 rtl:mr-2",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

/* ------------------------------------------------------------------ */
/*  AccordionContent                                                   */
/* ------------------------------------------------------------------ */

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = useAccordionContext();
    const value = React.useContext(AccordionItemContext);
    const isOpen = openItems.has(value);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState<number>(0);

    React.useEffect(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    }, [children, isOpen]);

    return (
      <div
        ref={ref}
        role="region"
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ height: isOpen ? `${height}px` : "0px" }}
        aria-hidden={!isOpen}
        {...props}
      >
        <div ref={contentRef} className={cn("pb-4 text-sm text-gray-600 leading-relaxed", className)}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
