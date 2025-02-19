<script lang="ts" setup>
defineSlots<{
  default: () => any
}>()
</script>

<template>
  <UPopover>
    <UButton variant="ghost" color="gray" icon="carbon:overflow-menu-horizontal" />
    <template #panel>
      <div class="w-60">
        <div class="p-1 flex flex-col">
          <slot></slot>
        </div>
      </div>
    </template>
  </UPopover>
</template>