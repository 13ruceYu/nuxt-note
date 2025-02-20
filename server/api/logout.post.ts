export default defineEventHandler(async (event) => {
  deleteCookie(event, 'NuxtNoteJWT', {
    path: '/',
  })

  return ""
})