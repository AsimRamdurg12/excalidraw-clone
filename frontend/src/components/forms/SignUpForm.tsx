import { useForm } from "react-hook-form";
import { SignUpSchema, type SignUpValues } from "../../schemas/AuthSchema";
import Input from "../../ui/Input";
import PasswordInput from "../../ui/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../ui/Button";
import { FaUser } from "react-icons/fa";
import { CgMail } from "react-icons/cg";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmitForm = async (data: SignUpValues) => {
    console.log(data);
  };
  return (
    <form
      className="flex flex-col bg-white w-full py-8 gap-2"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="flex flex-col gap-2 py-4">
        <Input
          {...register("name", {
            required: true,
          })}
          label="Name"
          placeholder="Your Display Name"
          Icon={<FaUser />}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
        <Input
          {...(register("email"),
          {
            required: true,
          })}
          label="Email"
          placeholder="Email address"
          Icon={<CgMail className="size-5" />}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <PasswordInput
          {...(register("password"),
          {
            required: true,
          })}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SignUpForm;
