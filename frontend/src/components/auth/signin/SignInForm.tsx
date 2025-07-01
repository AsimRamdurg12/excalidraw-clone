import { useForm } from "react-hook-form";
import { SignInSchema, type SignInValues } from "../../../schemas/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../ui/Button";
import { RiLoader4Line } from "react-icons/ri";
import SigninFields from "./SigninFields";
import { useSignin } from "./useSignin";

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  const { mutate, isPending, serverError } = useSignin(setError);

  return (
    <form
      className="flex flex-col bg-white w-full py-8 gap-2"
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <SigninFields register={register} errors={errors} />

      <Button
        type="submit"
        disabled={isPending}
        className={`${isPending && "bg-blue-300"}`}
      >
        {isPending ? (
          <p className="flex justify-center items-center gap-3">
            Signing in...
            <RiLoader4Line className="animate-spin" size={20} />
          </p>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
