import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  console.log('hello from user.post.ts')
  const body = await readBody(event)
  const res = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  })
  return {
    statusCode: 200,
    body: JSON.stringify(res)
  }
})