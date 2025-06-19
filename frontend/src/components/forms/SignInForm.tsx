import { useForm } from "react-hook-form";
import { SignInSchema, type SignInValues } from "../../schemas/AuthSchema";
import Input from "../../ui/Input";
import PasswordInput from "../../ui/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Button from "../../ui/Button";
import { FaUser } from "react-icons/fa";

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
      className="flex flex-col bg-white w-full py-8 gap-2"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="flex flex-col gap-2 pb-5">
        <Input label="Email" {...register("email")} Icon={<FaUser />} />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <PasswordInput {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>
      {errors.root && <p>{errors.root.message}</p>}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SignInForm;
