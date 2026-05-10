import * as React from "react";

import { cn } from "./utils";

type InputProps = React.ComponentProps<"input"> & {
  error?: string;
  state?: "default" | "success";
};

function Input({ className, type, error, state = "default", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        data-slot="input"
        aria-invalid={Boolean(error)}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-10 w-full min-w-0 rounded-sm border px-3 py-2 text-base bg-white transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:ring-2",
          error
            ? "border-brand-red focus-visible:border-brand-red focus-visible:ring-brand-red/30"
            : state === "success"
              ? "border-brand-green focus-visible:border-brand-green focus-visible:ring-brand-green/30"
              : "border-neutral-300 focus-visible:border-brand-gold focus-visible:ring-brand-gold/30",
          className,
        )}
        {...props}
      />
      {error && <span className="text-brand-red text-xs">{error}</span>}
    </div>
  );
}

export { Input };
