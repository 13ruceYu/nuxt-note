<script lang="ts" setup>
const logos = [
  {
    name: "Nuxt",
    path: "logos:nuxt-icon",
  },
  {
    name: "Vue",
    path: "logos:vue",
  },
  {
    name: "Prisma",
    path: "logos:prisma",
  },

  {
    name: "Pinia",
    path: "logos:pinia",
  },
  {
    name: "Vercel",
    path: "logos:vercel-icon",
  }
]
</script>

<template>
  <AuroraBackground>
    <div class="fixed left-0 top-0 z-50 flex w-full justify-center p-4">
      <nav class="rounded-full border border-neutral-600 px-4 py-2">
        <ul class="flex items-center justify-center gap-1">
          <!-- TODO: fix nuxt-icon update issue -->
          <Icon class="size-8" name="my-icon:logo"></Icon>
          <li class="nav-item">Highlights</li>
          <li class="nav-item">Tech Stack</li>
          <nuxt-link to="'/login'" class="nav-item">Login</nuxt-link>
          <li>
            <UButton to="https://github.com/13ruceYu/nuxt-note" target="_blank" icon="carbon:logo-github"
              variant="ghost" color="gray"></UButton>
          </li>
        </ul>
      </nav>
    </div>
    <div class="flex flex-col items-center justify-center px-2">
      <h1 class="mt-24 text-3xl md:text-5xl">Welcome to <span class="text-primary">Nuxt Note</span></h1>
      <p class="my-9 text-sm">Your personal note-taking application built with Nuxt. Start organizing your thoughts and
        ideas
        efficiently.</p>
      <div class="z-10">
        <UButton class="z-10 gap-1 rounded-full" size="xl" to="/login" variant="outline">
          <Icon class="size-6" name="my-icon:logo"></Icon> Writing now
        </UButton>
      </div>
      <div class="mt-8 w-full max-w-[600px]">
        <NuxtImg class="overflow-hidden rounded-lg border border-neutral-600 shadow-lg"
          src="/images/app-screenshot.png">
        </NuxtImg>
      </div>
      <AnimatedLogoCloud :logos title="Tech Stack" />
    </div>
  </AuroraBackground>
</template>

<style scoped lang="postcss">
.nav-item {
  @apply text-sm cursor-pointer rounded-md px-2 py-1 hover:bg-neutral-800/80 transition-all duration-500;
}
</style>
