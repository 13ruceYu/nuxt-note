<script setup lang="ts">
defineSlots<{
  default: () => any
}>()
</script>

<template>
  <AuroraBackground>
    <div class="z-10 grid h-screen w-full bg-transparent md:grid-cols-2">
      <div class="flex items-center justify-center px-4">
        <div class="w-full max-w-[26rem] overflow-hidden">
          <div
            class="rounded-2xl border-2 border-black/10 bg-white/30 p-6 shadow-none backdrop-blur-xl dark:border-white/20 dark:bg-black/10">
            <div class="mb-6">
              <Logo />
            </div>
            <div class="flex flex-col">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden items-center justify-center md:flex">
        <div class="text-center">
          <div class="slogan text-3xl font-light">
            Turn mental noise into written wisdom.
          </div>
        </div>
      </div>
    </div>
  </AuroraBackground>
</template>

<style scoped>
.slogan {
  font-family: Parisienne, serif;
}
</style>