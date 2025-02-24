// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt', '@nuxt/fonts', 'pinia-plugin-persistedstate/nuxt'],
  colorMode: {
    preference: 'dark',
  },
  app: {
    head: {
      charset: 'utf-8',
      meta: [
        {
          name: 'description',
          content: 'Nuxt Note'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.png'
        }
      ]
    }
  },
})
