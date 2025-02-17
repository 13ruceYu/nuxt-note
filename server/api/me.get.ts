import prisma from "~/prisma/db"

export default defineEventHandler(async (event) => {
  try {
    const { id } = verifyJwt(event)
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true
      }
    })
    return user
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
})