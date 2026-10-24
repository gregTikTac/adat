import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Size and aspect ratio of the frame. The picture fills it. */
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/**
 * Photo with a warm light along its edges. On hover the picture zooms in
 * noticeably and the glow gets stronger. The frame keeps its plain rectangle.
 */
export function GlowImage({ src, alt, className, imgClassName, priority = false }: Props) {
  return (
    <div className={cn("glow-frame group relative overflow-hidden bg-[#d8cbb2]", className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.14]",
          imgClassName,
        )}
      />
      <span aria-hidden className="glow-edge pointer-events-none absolute inset-0" />
    </div>
  );
}
