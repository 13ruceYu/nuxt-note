import prisma from "~/lib/prisma"
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    const validPassword = await bcrypt.compare(body.password, user.password)
    if (!validPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    const token = signJwt({ id: user.id })

    setCookie(event, 'NuxtNoteJWT', token)

    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error
    })
  }
})