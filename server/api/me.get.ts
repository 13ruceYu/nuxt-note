import prisma from "~/prisma/db"

export default defineEventHandler(async (event) => {
  const { id } = verifyJwt(event)
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true
    }
  })
  return user
})