import prisma from "~/prisma/db"

export default defineEventHandler(async (event) => {
  try {
    const user = verifyJwt(event)
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id
      }
    })
    return notes
  } catch (error) {
    console.log(error)
  }
})