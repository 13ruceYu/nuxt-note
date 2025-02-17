import prisma from "~/prisma/db"
import { verifyJwt } from "~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = verifyJwt(event)
    const noteId = parseInt(event.context.params?.id as string)

    // Check if note exists and belongs to user
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

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting note:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete note'
    })
  }
})