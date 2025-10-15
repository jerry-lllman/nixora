import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:border-border [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow border-primary hover:bg-primary/90 hover:border-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive hover:bg-destructive/90 hover:border-destructive/90",
        outline:
          "border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm border-secondary hover:bg-secondary/80 hover:border-secondary/80",
        ghost:
          "border-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent",
        link: "text-primary underline-offset-4 border-transparent hover:underline"
      },
      size: {
        small: "h-8 rounded-md px-3 text-xs",
        medium: "h-9 px-4 py-2",
        large: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  text?: string;
  fullWidth?: boolean;
  icon?: string | React.ReactNode;
}

const NixoraButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth, icon, text, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && (
          typeof icon === "string" ? (
            <span className="button-icon">{icon}</span>
          ) : (
            icon
          )
        )}
        {text || children}
      </Comp>
    );
  }
);
NixoraButton.displayName = "NixoraButton";

export { NixoraButton, buttonVariants };
