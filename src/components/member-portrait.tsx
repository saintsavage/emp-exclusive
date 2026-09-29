import { cn } from "@/lib/utils";
import { memberInitials } from "@/lib/emp/house";

export function MemberPortrait({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={name} className={cn("object-cover object-top", className)} />;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-elevated font-display tracking-[0.18em] text-fg",
        className,
      )}
      aria-label={name}
    >
      {memberInitials(name)}
    </div>
  );
}
