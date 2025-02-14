export default defineEventHandler(async (event) => {
  const user = verifyJwt(event)
  console.log({ user })
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from public route!' })
  }
})