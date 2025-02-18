import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password cannot be empty"),
})

export type SignupUser = z.infer<typeof signupSchema>
export type LoginUser = z.infer<typeof loginSchema>