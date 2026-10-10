import * as React from "react";
import { cn, fieldClass } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(fieldClass, className)} {...p} />
);
Input.displayName = "Input";
