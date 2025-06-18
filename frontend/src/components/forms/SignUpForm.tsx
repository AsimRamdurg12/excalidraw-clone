import { useForm } from "react-hook-form";
import { SignUpSchema, type SignUpValues } from "../../schemas/AuthSchema";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../ui/Button";

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
      className="flex flex-col flex-wrap justify-center items-center bg-white w-fit px-4 py-8 rounded-l-lg gap-2"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="p-4 border rounded-xl shadow bg-gray-100 w-64 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <h2 className="text-lg font-bold">SignUp</h2>
      <div className="flex flex-col gap-2">
        <Input
          {...register("name", {
            required: true,
          })}
          label="Name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
        <Input {...register("email")} label="Email" />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <PasswordInput {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SignUpForm;
