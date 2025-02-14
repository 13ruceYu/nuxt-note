export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/api')) return

  const jwt = useCookie('NuxtNoteJWT')

  const publicPages = ['/register', '/login']

  if (!jwt.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
  if (jwt.value && publicPages.includes(to.path)) {
    return navigateTo('/')
  }
})

