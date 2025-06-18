import { z } from "zod";

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "name must be atleast 2 characters" })
    .max(100),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" })
    .max(20)
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain atleast one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain atleast one lowercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Password must contain at least one special character",
    }),
});

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("please enter a valid email"),
  password: z.string().min(1, "please enter password"),
});

export type SignInValues = z.infer<typeof SignInSchema>;
