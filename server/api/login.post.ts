import bcrypt from 'bcryptjs'
import prisma from "~/prisma/db"
import { validateSchema } from '~/server/utils/validation'
import { loginSchema } from '~/types/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 输入验证
  const validatedData = validateSchema(loginSchema, body)

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // 验证密码
  const validPassword = await bcrypt.compare(validatedData.password, user.password)
  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // JWT token 生成与设置
  const token = signJwt({ id: user.id })
  setCookie(event, 'NuxtNoteJWT', token)

  return {
    id: user.id,
    email: user.email,
  }
})