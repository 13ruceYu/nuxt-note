import { useUserStore } from '~/store/user'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()

  // Fetch user info on app init
  await userStore.fetchUser()
})