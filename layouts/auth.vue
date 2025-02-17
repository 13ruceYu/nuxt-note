<script setup lang="ts">
defineSlots<{
  default: () => any
}>()
</script>

<template>
  <div class="grid grid-cols-2 h-screen">
    <div class="dark:bg-neutral-800 bg-neutral-100 flex flex-col justify-center items-center px-8">
      <div class="w-full max-w-[24rem]">
        <div>
          <Logo />
        </div>
        <div class="flex flex-col">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center italic px-8">
      Turn mental noise into written wisdom.
    </div>
  </div>
</template>