"use client";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function Button({
  className,
  variant = "primary",
  loading = false,
  children,
  disabled,
  ...rest
}: Props) {
  const base = "btn";
  const variants: Record<string, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
