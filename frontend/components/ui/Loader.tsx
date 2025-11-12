"use client";
export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-sm text-gray-200">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        {label}
      </div>
    </div>
  );
}
