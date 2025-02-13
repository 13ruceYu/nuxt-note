// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  app: {
    head: {
      charset: 'utf-8',
      title: 'Nuxt Note',
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