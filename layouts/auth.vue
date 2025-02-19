<script setup lang="ts">
defineSlots<{
  default: () => any
}>()
</script>

<template>
  <div class="grid md:grid-cols-2 h-screen">
    <div class="dark:bg-neutral-800 bg-neutral-100 flex flex-col justify-center items-center px-4 md:px-8">
      <div class="w-full max-w-[30rem]">
        <div class="mb-8">
          <Logo />
        </div>
        <div class="flex flex-col">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- Hide on mobile, show on large screens -->
    <div class="hidden md:flex flex-col justify-center items-center italic px-8 text-center">
      Turn mental noise into written wisdom.
    </div>
  </div>
</template>