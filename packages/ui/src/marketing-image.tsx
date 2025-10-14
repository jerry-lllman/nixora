import { clsx } from "clsx";

export type MarketingImageFit = "cover" | "contain" | "fill";

export interface MarketingImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: MarketingImageFit;
  rounded?: boolean;
  className?: string;
}

const fitClasses: Record<MarketingImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill"
};

export function MarketingImage({
  src,
  alt = "",
  width = "100%",
  height = "auto",
  fit = "cover",
  rounded = false,
  className
}: MarketingImageProps) {
  return (
    <div
      className={clsx("overflow-hidden", rounded && "rounded-lg", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height
      }}
    >
      <img
        src={src}
        alt={alt}
        className={clsx("w-full h-full", fitClasses[fit])}
      />
    </div>
  );
}
