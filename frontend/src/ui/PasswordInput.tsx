import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { cn } from "../lib/utils";
import { CgLock } from "react-icons/cg";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2 justify-between">
      <label htmlFor="name" className="text-start font-semibold">
        Password
      </label>
      <div
        className={cn(
          "group flex items-center border px-2 border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
          className
        )}
      >
        <CgLock />
        <input
          type={show ? "text" : "password"}
          {...props}
          ref={ref}
          className="p-2 focus:outline-none w-full"
        />
        <div onClick={() => setShow(!show)}>
          {show ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
