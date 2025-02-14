export default defineEventHandler(async (event) => {
  deleteCookie(event, 'NuxtNoteJWT', {
    path: '/',
  })

  return {
    statusCode: 200,
    body: 'Logged out successfully'
  }
})