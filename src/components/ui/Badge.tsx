type BadgeProps = {
  children: React.ReactNode;
  tone?: "amber" | "pink" | "green" | "lilac";
  className?: string;
};

const toneMap: Record<NonNullable<BadgeProps["tone"]>, string> = {
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  pink: "bg-rose-100 text-rose-700 border-rose-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  lilac: "bg-purple-100 text-purple-700 border-purple-200",
};

export function Badge({ children, tone = "amber", className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[tone]} ${className || ""}`}
    >
      {children}
    </span>
  );
}

