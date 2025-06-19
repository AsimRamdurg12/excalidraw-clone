import React from "react";

interface Input extends React.ComponentProps<"input"> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, Input>(({ ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="name" className="font-semibold">
        {props.label}
      </label>

      <input
        {...props}
        ref={ref}
        className="p-2 w-full focus:outline-none border border-gray-500 rounded-lg"
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
