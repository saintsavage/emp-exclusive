import { useEffect, useState } from "react";
import type { Post } from "@/lib/emp/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function StoriesStrip({ stories }: { stories: Post[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (stories.length === 0) return null;

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {stories.map((story, i) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setIndex(i)}
            className="flex w-20 shrink-0 flex-col items-center gap-2"
          >
            <span className="rounded-full p-0.5 shadow-[var(--shadow-border-hover)]">
              <img
                src={story.mediaUrl || "/images/avatar.png"}
                alt=""
                className="size-[4.5rem] rounded-full object-cover"
              />
            </span>
            <span className="line-clamp-1 w-full text-center text-xs text-muted">
              {story.title || "Story"}
            </span>
          </button>
        ))}
      </div>

      <StoryViewer
        stories={stories}
        index={index}
        onClose={() => setIndex(null)}
        onIndex={setIndex}
      />
    </>
  );
}

export function StoryViewer({
  stories,
  index,
  onClose,
  onIndex,
}: {
  stories: Post[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number | null) => void;
}) {
  const story = index === null ? null : stories[index];

  useEffect(() => {
    if (index === null) return;
    const id = window.setTimeout(() => {
      if (index >= stories.length - 1) onClose();
      else onIndex(index + 1);
    }, 5000);
    return () => window.clearTimeout(id);
  }, [index, stories.length, onClose, onIndex]);

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm overflow-hidden rounded-xl bg-bg p-0">
        <DialogTitle className="sr-only">{story?.title || "Story"}</DialogTitle>
        {story ? (
          <div className="relative aspect-story bg-bg">
            <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
              {stories.map((_, i) => (
                <span
                  key={stories[i].id}
                  className={cn("h-0.5 flex-1 rounded-full bg-fg/25", i <= (index ?? 0) && "bg-fg")}
                />
              ))}
            </div>
            <img
              src={story.mediaUrl || ""}
              alt={story.title || ""}
              className="size-full object-contain bg-bg"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-bg to-transparent p-5 pt-16">
              <p className="font-display text-2xl">{story.title}</p>
              <p className="mt-1 text-sm text-muted">{story.body}</p>
            </div>
            <button
              type="button"
              aria-label="Previous"
              className="absolute inset-y-0 left-0 w-1/3"
              onClick={() => {
                if (index === null) return;
                if (index === 0) onClose();
                else onIndex(index - 1);
              }}
            />
            <button
              type="button"
              aria-label="Next"
              className="absolute inset-y-0 right-0 w-1/3"
              onClick={() => {
                if (index === null) return;
                if (index >= stories.length - 1) onClose();
                else onIndex(index + 1);
              }}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
