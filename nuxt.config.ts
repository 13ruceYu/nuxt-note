// https://nuxt.com/docs/api/configuration/nuxt-config
import { createRequire } from 'module'
import path from 'path'

const { resolve } = createRequire(import.meta.url)

const prismaClient = `prisma${path.sep}client`
const prismaClientIndexBrowser = resolve('@prisma/client/index-browser').replace(`@${prismaClient}`, `.${prismaClient}`)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', "@prisma/nuxt", '@vueuse/nuxt'],
  vite: {
    resolve: { alias: { '.prisma/client/index-browser': path.relative(__dirname, prismaClientIndexBrowser) } }
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