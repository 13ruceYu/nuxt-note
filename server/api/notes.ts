import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  try {
    const notes = await prisma.note.findMany()

    return  notes
  } catch (error) {
    console.log(error)
  }
})