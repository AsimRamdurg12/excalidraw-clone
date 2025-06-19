import React from "react";
import { cn } from "../lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "py-2 px-4 rounded-md bg-blue-600 text-white font-semibold",
        className
      )}
    ></button>
  );
});

Button.displayName = "Button";

export default Button;
