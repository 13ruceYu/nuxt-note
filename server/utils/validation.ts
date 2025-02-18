import { z } from 'zod'

export function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ')

      throw createError({
        statusCode: 400,
        message: errorMessage,
        data: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
    throw error
  }
}
