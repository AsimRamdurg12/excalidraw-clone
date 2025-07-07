import { useForm } from "react-hook-form";
import { SignUpSchema, type SignUpValues } from "../../../schemas/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "./useSignUp";
import SignupFields from "./SignupFields";
import Button from "../../../ui/Button";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const { mutate, isPending, serverError } = useSignUp(setError);

  return (
    <form
      className="flex flex-col w-full py-8 gap-2"
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <SignupFields register={register} errors={errors} />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Submit"}
      </Button>
    </form>
  );
};

export default SignUpForm;
