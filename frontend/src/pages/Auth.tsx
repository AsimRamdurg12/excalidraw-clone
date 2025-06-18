import { useState } from "react";
import SignInForm from "../components/forms/SignInForm";
import SignUpForm from "../components/forms/SignUpForm";

const Auth = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex px-4 py-8">
        <div className="flex relative shadow rounded-lg">
          <div
            className={`absolute flex flex-col justify-center items-center overflow-hidden w-1/2 h-full rounded-lg bg-gradient-to-r from-violet-50 via-pink-200 to-blue-200 text-white ${
              toggle
                ? "transform transition-transform duration-700 translate-x-[100%] bg-gradient-to-l from-blue-500 to-red-200"
                : "translate-x-0 duration-700"
            }`}
          >
            Asim
            <button onClick={() => setToggle(!toggle)}>Toggle</button>
          </div>
          <SignUpForm />
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
