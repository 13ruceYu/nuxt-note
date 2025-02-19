import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    setUser(user: User) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    async fetchUser() {
      const jwtCookie = useCookie('NuxtNoteJWT')
      if (!jwtCookie.value) {
        this.clearUser()
        return
      }
      try {
        const user = await $fetch('/api/me')
        if (user) {
          this.setUser(user)
        } else {
          this.clearUser()
        }
      } catch {
        this.clearUser()
      }
    }
  }
})