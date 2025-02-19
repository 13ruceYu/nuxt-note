import prisma from "~/prisma/db"
import bcrypt from 'bcryptjs'
import { signupSchema } from '~/types/schema'
import { validateSchema } from "../utils/validation"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate request data
    const validatedData = validateSchema(signupSchema, body)

    // Hash password - no need to store salt separately
    const hash = await bcrypt.hash(validatedData.password, 10)

    const res = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hash
      }
    })

    const token = signJwt({ id: res.id })
    setCookie(event, 'NuxtNoteJWT', token)

    return {
      statusCode: 200,
      body: JSON.stringify(res)
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create user'
    })
  }
})