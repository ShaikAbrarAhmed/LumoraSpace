import Image from "next/image"

type LogoSize = "sm" | "md" | "lg" | "xl"

export interface LogoProps {
  className?: string
  size?: LogoSize
  /**
   * "primary" shows the full star artwork with its glow (3:2 box).
   * "icon" is a square crop centred on the star, for tight spots like the header.
   */
  variant?: "primary" | "icon"
  /** Drops the card frame around the mark. */
  flat?: boolean
  /** Pass "" when the name "LumoraSpace" is already written next to the mark. */
  alt?: string
  /** Preload in the document head. Only for the page's LCP image (see next/image `preload`). */
  preload?: boolean
  /** Use "eager" for marks that are always above the fold, such as the header. */
  loading?: "eager" | "lazy"
}

// public/logo4.png is a 1536x1024 transparent PNG with the star centred in the frame.
const SRC = "/logo4.png"

const primarySizes: Record<LogoSize, { box: string; sizes: string }> = {
  sm: { box: "h-10 w-[60px]", sizes: "60px" },
  md: { box: "h-12 w-[72px]", sizes: "72px" },
  lg: { box: "h-14 w-[84px] sm:h-16 sm:w-24 md:h-[72px] md:w-[108px]", sizes: "(min-width: 768px) 108px, 96px" },
  xl: { box: "h-20 w-[120px]", sizes: "120px" },
}

// The icon crop scales the image 1.6x inside a square, so it needs roughly 2.4x the box width.
const iconSizes: Record<LogoSize, { box: string; sizes: string }> = {
  sm: { box: "h-8 w-8", sizes: "77px" },
  md: { box: "h-10 w-10", sizes: "96px" },
  lg: { box: "h-14 w-14 md:h-[60px] md:w-[60px]", sizes: "144px" },
  xl: { box: "h-20 w-20", sizes: "192px" },
}

export function Logo({
  className = "",
  size = "md",
  variant = "primary",
  flat = false,
  alt = "LumoraSpace",
  preload = false,
  loading,
}: LogoProps) {
  const frame = flat
    ? ""
    : "rounded-xl border border-white/[0.08] bg-[#0B0B0C] shadow-[0_4px_20px_rgba(0,0,0,0.25)]"

  // `preload` and `loading` should not be combined (next/image docs).
  const loadProps = preload ? { preload: true } : { loading }

  if (variant === "icon") {
    const { box, sizes } = iconSizes[size]
    return (
      <span className={`relative inline-block shrink-0 overflow-hidden ${box} ${frame} ${className}`}>
        <Image src={SRC} alt={alt} fill sizes={sizes} className="scale-[1.6] object-cover" {...loadProps} />
      </span>
    )
  }

  const { box, sizes } = primarySizes[size]
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden ${box} ${frame} ${flat ? "" : "p-1.5"} ${className}`}>
      <Image src={SRC} alt={alt} fill sizes={sizes} className="object-contain" {...loadProps} />
    </span>
  )
}
