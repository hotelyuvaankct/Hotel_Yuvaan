import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Site-wide Button — pill shape + fixed heights on every variant.
 * Label casing is left as written by the caller.
 *
 * Variants: default/solid | outline | dark | ghost | soft/secondary | destructive | link | subtle
 * Sizes: default (48px) | sm (40px) | icon | icon-sm
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Solid gold fill — primary marketing CTA */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        solid:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        /** Cream fill + gold border/text */
        outline:
          "border-[1.5px] border-primary bg-[#fff8ee] text-primary hover:bg-primary/10",
        /** Hotel brown fill */
        dark: "bg-[#4b3621] text-white hover:bg-[#3d2b1a]",
        /** Transparent on dark imagery */
        ghost:
          "border-[1.5px] border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10",
        /** Quiet secondary on light surfaces */
        soft: "bg-[#f3ebe0] text-[#4b3621] hover:bg-[#ebe1d2]",
        secondary: "bg-[#f3ebe0] text-[#4b3621] hover:bg-[#ebe1d2]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /** Text-only; height not forced */
        link: "h-auto rounded-none px-0 text-primary underline-offset-4 hover:underline",
        /** Compact UI (calendar days, etc.) — not a marketing CTA */
        subtle:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-5",
        icon: "h-12 w-12 p-0",
        "icon-sm": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "link",
        class: "h-auto min-h-0 px-0 py-0 shadow-none",
      },
    ],
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
