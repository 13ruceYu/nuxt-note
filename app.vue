<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Nuxt Note` : 'Nuxt Note';
  }
})
</script>

<template>
  <div>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
