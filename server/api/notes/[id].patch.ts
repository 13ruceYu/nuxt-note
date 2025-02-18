import prisma from "~/prisma/db"
import { verifyJwt } from "~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = verifyJwt(event)
    const noteId = parseInt(event.context.params?.id as string)
    const body = await readBody(event)

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { userId: true }
    })

    if (!note || note.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { text: body.text, title: body.title }
    })

    return updatedNote
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update note'
    })
  }
})