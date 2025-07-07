import Input from "../../../ui/Input";
import PasswordInput from "../../../ui/PasswordInput";
import { CgMail } from "react-icons/cg";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { SignInValues } from "../../../schemas/AuthSchema";

type Props = {
  register: UseFormRegister<SignInValues>;
  errors: FieldErrors<SignInValues>;
};

const SigninFields = ({ register, errors }: Props) => (
  <div className="flex flex-col gap-2 py-4">
    <Input
      {...register("email")}
      label="Email"
      placeholder="Email address"
      Icon={<CgMail className="size-5" />}
    />
    {errors.email && (
      <p className="text-red-500 text-xs">{errors.email.message}</p>
    )}

    <PasswordInput
      {...register("password")}
      placeholder="Enter your password"
    />
    <a
      href="/reset-password"
      className="flex justify-end w-fit text-xs underline text-gray-500 hover:text-gray-300 font-medium"
    >
      forgot password?
    </a>
    {errors.password && (
      <p className="text-red-500 text-xs">{errors.password.message}</p>
    )}
  </div>
);

export default SigninFields;
