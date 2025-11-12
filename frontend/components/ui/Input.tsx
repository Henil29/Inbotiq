"use client";
import clsx from "clsx";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, label, ...rest }, ref) => {
    return (
      <label className="block space-y-1">
        {label && <span className="text-xs font-medium text-gray-300">{label}</span>}
        <input ref={ref} className={clsx("input", className)} {...rest} />
        {error && <div className="text-xs text-rose-400">{error}</div>}
      </label>
    );
  }
);
Input.displayName = "Input";

export default Input;
