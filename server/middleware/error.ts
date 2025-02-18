import { H3Error } from 'h3'

export default defineEventHandler((event) => {
  event.node.res.on('error', (error: H3Error) => {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  })
})
