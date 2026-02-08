import { ComponentProps, forwardRef } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outline" | "static";
  tone?: "amber" | "pink" | "green" | "lilac";
};

const toneMap: Record<NonNullable<ButtonProps["tone"]>, string> = {
  amber: "bg-[#670E10] text-[#EBE5DA]",
  pink: "bg-[#E84A6A] text-white",
  green: "bg-[#36794B] text-white",
  lilac: "bg-[#75627E] text-white",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", tone = "amber", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-soft-spring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        toneMap[tone] +
        " shadow-soft hover:shadow-lg hover:-translate-y-[1px] hover:opacity-95 active:translate-y-0",

      ghost:
        "bg-transparent text-[#1f2937] hover:bg-white/20",

      outline:
        "border border-[#0b3c5d] text-[#0b3c5d] bg-transparent hover:bg-[#ace4ff]/30",

      static:
        "bg-[#0B3C5D] text-white shadow-soft hover:bg-[#0B3C5D] hover:shadow-soft hover:translate-y-0 hover:opacity-100 active:translate-y-0",
    };

    return (
      <button
        ref={ref}
        className={[base, variants[variant], className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
