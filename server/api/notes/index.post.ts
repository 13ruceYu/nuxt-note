import prisma from "~/prisma/db"
import { verifyJwt } from "~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = verifyJwt(event)

    const body = await readBody(event)

    const note = await prisma.note.create({
      data: {
        title: body.title || '',
        text: body.text || '',
        userId
      }
    })

    return note
  } catch (error: any) {
    throw createError(error)
  }
})