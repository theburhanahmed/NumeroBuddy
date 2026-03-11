/**
 * Spacer Component
 * 
 * Utility component for consistent spacing using design tokens.
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { spacing } from "@/design-system/tokens"

export interface SpacerProps {
  size?: keyof typeof spacing | "section-sm" | "section-md" | "section-lg"
  axis?: "x" | "y" | "both"
  className?: string
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 4, axis = "y", className }, ref) => {
    const spacingValue: string | number =
      size === "section-sm" ? spacing.section.sm :
      size === "section-md" ? spacing.section.md :
      size === "section-lg" ? spacing.section.lg :
      (spacing as unknown as Record<string, string | number>)[String(size)] ?? spacing[4]

    const style: React.CSSProperties = {}
    
    if (axis === "x" || axis === "both") {
      style.width = spacingValue as React.CSSProperties['width']
    }
    if (axis === "y" || axis === "both") {
      style.height = spacingValue as React.CSSProperties['height']
    }

    return (
      <div
        ref={ref}
        className={cn("flex-shrink-0", className)}
        style={style}
        aria-hidden="true"
      />
    )
  }
)
Spacer.displayName = "Spacer"

export { Spacer }

