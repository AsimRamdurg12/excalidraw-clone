import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter valid email"),
  password: z
    .string()
    .min(8)
    .max(100)
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain one uppercase letter"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain one smallcase letter"
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain one numerical character"
    )
    .refine(
      (password) => /[!@#$%^&*]/.test(password),
      "Password must contain one special character"
    ),
});

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const roomSchema = z.object({
  slug: z.string().min(3, "Please enter room name").max(100),
});
