// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/fonts',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/image'
  ],
  colorMode: {
    preference: 'dark',
  },
  icon: {
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/my-icons'
      },
    ]
  },
  app: {
    head: {
      charset: 'utf-8',
      meta: [
        {
          name: 'description',
          content: 'Nuxt Note'
        },
        // Open Graph / Social Media Meta Tags
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Nuxt Note' },
        { property: 'og:description', content: 'Nuxt Note - Your personal note taking app' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: process.env.APP_URL || 'http://localhost:3000' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        // Apple specific meta tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Nuxt Note' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.png'
        },
        // Apple Touch Icons
        { rel: 'apple-touch-icon', href: '/logo.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/logo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
      ]
    }
  },
  runtimeConfig: {
    // Private keys are only available on the server
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

    // Public keys that are exposed to the client
    public: {
      githubClientId: process.env.GITHUB_CLIENT_ID,
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    }
  }
})