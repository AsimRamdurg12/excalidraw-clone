import { useState } from "react";
import Button from "../ui/Button";
import SignUpForm from "../components/forms/SignUpForm";
import SignInForm from "../components/forms/SignInForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center border px-4 py-8 rounded-xl border-gray-500">
          <div>
            <h2 className="text-2xl font-bold">
              {isSignUp ? "Welcome to DrawingBoard" : "Welcome Back!"}
            </h2>
            <p className="text-gray-700">
              {isSignUp
                ? "Sign Up to create account"
                : "Sign in to your account."}
            </p>
          </div>

          <div className="relative w-full flex gap-2 bg-gray-200 p-1 rounded-full">
            <div
              className={`absolute top-1 border bottom-1 w-[49%] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                isSignUp ? "transform translate-x-full" : ""
              }`}
            ></div>
            <Button
              onClick={() => setIsSignUp(false)}
              className={` relative text-black w-full bg-transparent rounded-full transition-colors duration-200 `}
            >
              Sign In
            </Button>
            <Button
              onClick={() => setIsSignUp(true)}
              className={`relative bg-transparent w-full text-black transition-colors rounded-full duration-200`}
            >
              Sign Up
            </Button>
          </div>

          <div className="flex justify-center">
            {isSignUp ? <SignUpForm /> : <SignInForm />}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-gray-600 bg-transparent p-0 underline hover:text-blue-500 transition-colors duration-200"
              >
                {isSignUp ? "Sign in here" : "Sign up for free"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
