import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full resize-y rounded-lg bg-transparent px-0 py-1 text-base text-fg outline-none placeholder:text-subtle focus-visible:ring-0 disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
