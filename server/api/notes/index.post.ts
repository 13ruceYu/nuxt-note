import prisma from "~/prisma/db"
import { verifyJwt } from "~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = verifyJwt(event)

    const note = await prisma.note.create({
      data: {
        title: 'Untitled',
        text: '',
        userId
      }
    })

    return note
  } catch (error: any) {
    console.error('Error creating note:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create note'
    })
  }
})