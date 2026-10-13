import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function ZoomImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open, mounted]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block h-full w-full cursor-zoom-in overflow-hidden"
        aria-label={`View ${alt || "image"}`}
      >
        <img src={src} alt={alt} className={className} />
      </button>
      {mounted
        ? createPortal(
            <dialog
              ref={dialogRef}
              className="emp-zoom"
              aria-label={alt || "Full image"}
              onClose={() => setOpen(false)}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <button
                type="button"
                className="emp-zoom-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
              <img src={src} alt={alt} className="emp-zoom-img" />
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
