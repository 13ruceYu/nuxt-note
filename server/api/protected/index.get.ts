export default defineEventHandler(async (event) => {
  verifyJwt(event)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from protected route!' })
  }
});