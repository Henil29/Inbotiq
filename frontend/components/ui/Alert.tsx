"use client";
import clsx from "clsx";

type Props = {
  type?: "error" | "success" | "info";
  message: string | null;
  onClose?: () => void;
};

export default function Alert({ type = "info", message, onClose }: Props) {
  if (!message) return null;
  const styles: Record<string, string> = {
    error: "bg-rose-600/20 border-rose-600 text-rose-200",
    success: "bg-emerald-600/20 border-emerald-600 text-emerald-200",
    info: "bg-sky-600/20 border-sky-600 text-sky-200",
  };
  return (
    <div className={clsx("rounded-md border px-3 py-2 text-sm", styles[type])}>
      <div className="flex items-start justify-between gap-4">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
