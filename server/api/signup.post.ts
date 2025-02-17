import prisma from "~/prisma/db"
import bcrypt from 'bcryptjs'
import { userSchema } from '~/server/types/schema'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate request data
    const validatedData = userSchema.parse(body)

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
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: error.errors.map((err: any) => err.message).join('. ')
      })
    }

    // Handle duplicate email error
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'Email already exists'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})