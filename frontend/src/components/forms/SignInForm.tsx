import { useForm } from "react-hook-form";
import { SignInSchema, type SignInValues } from "../../schemas/AuthSchema";
import Input from "../../ui/Input";
import PasswordInput from "../../ui/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Button from "../../ui/Button";

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitForm = async (data: SignInValues) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/sign-in",
        data
      );
      const result = await response.data;

      console.log(result);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError("root", axiosError);
    }
  };
  return (
    <form
      className="flex flex-col text-wrap justify-center items-center bg-white w-fit px-4 py-8 rounded-r-lg gap-2"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <h2 className="text-xl font-bold">Login</h2>
      <div className="flex flex-col gap-2">
        <Input label="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <PasswordInput {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      {errors.root && <p>{errors.root.message}</p>}
      <Button type="submit" className="w-40">
        Submit
      </Button>
    </form>
  );
};

export default SignInForm;
