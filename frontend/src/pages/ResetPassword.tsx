import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import { useOtpTimer } from "../hooks/useSetTimer";
import { useSendResetEmail } from "../hooks/auth/useSendResetEmail";
import { useVerifyOtp } from "../hooks/auth/useVerifyOtp";
import { useResetPassword } from "../hooks/auth/useResetPassword";
import { CgMail } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const { minutes, seconds, expired } = useOtpTimer(isEmailSent);

  const sendEmailMutation = useSendResetEmail(() => setIsEmailSent(true));
  const verifyOtpMutation = useVerifyOtp(email, () => setIsOtpSubmitted(true));
  const resetPasswordMutation = useResetPassword(email);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200">
      {!isEmailSent && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            sendEmailMutation.mutate(email);
          }}
          className="p-4 drop-shadow-2xl rounded-lg flex flex-col justify-center gap-2 w-96 bg-neutral-900 text-white"
        >
          <h2 className="font-semibold text-3xl">Reset Password</h2>
          <p>Enter your registered email</p>
          <Input
            type="email"
            placeholder="Email"
            Icon={<CgMail size={25} />}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            verifyOtpMutation.mutate(otp);
          }}
          className="border p-4 rounded-lg flex flex-col justify-center gap-2 w-96 bg-neutral-900 text-white"
        >
          <h2 className="font-semibold text-3xl">Enter OTP</h2>
          <Input
            maxLength={6}
            className="text-center text-xl font-medium"
            onChange={(e) => setOtp(e.target.value)}
          />
          {!expired && (
            <p className="text-sm text-center">
              Expires in: {minutes}:{seconds}
            </p>
          )}
          <Button>Submit</Button>
          <Button
            disabled={!expired}
            className={`${!expired && "bg-blue-300"}`}
          >
            Resend OTP
          </Button>
        </form>
      )}

      {isOtpSubmitted && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            resetPasswordMutation.mutate(newPassword);
            navigate("/user/authenticate");
          }}
          className="border p-4 rounded-lg flex flex-col justify-center gap-2 w-96 bg-neutral-900 text-white"
        >
          <h2 className="font-semibold text-3xl">Enter New Password</h2>
          <PasswordInput onChange={(e) => setNewPassword(e.target.value)} />
          <Button>Submit</Button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
