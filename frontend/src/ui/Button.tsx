import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ ...props }) => {
  return (
    <button
      {...props}
      className="py-2 px-4 rounded-md bg-blue-600 text-white font-semibold"
    ></button>
  );
});

Button.displayName = "Button";

export default Button;
