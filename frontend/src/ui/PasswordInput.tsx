import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ ...props }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="name" className="font-semibold">
        Password
      </label>
      <div className="flex border border-gray-500 justify-center items-center rounded-lg">
        <input
          type={show ? "text" : "password"}
          {...props}
          ref={ref}
          className="p-2 w-full focus:outline-none"
        />
        <div onClick={() => setShow(!show)} className="p-2">
          {show ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
