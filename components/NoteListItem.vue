<script setup lang="ts">
import type { ExtendedNote } from '~/types/note';

const props = defineProps<{
  note: ExtendedNote,
  active?: boolean
}>()

</script>

<template>
  <div class="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700 md:p-2"
    :class="{ 'bg-gray-200 dark:bg-zinc-700': active }" @click="$emit('click')">
    <div class="truncate text-base leading-5">
      {{ note.title || 'Untitled' }}
    </div>
    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
      <div class="mr-4 shrink-0">{{ useDateFormat(note.createdAt, "YYYY-MM-DD HH:mm") }}</div>
      <div class="truncate">
        {{ note.text || 'No content' }}
      </div>
    </div>
  </div>
</template>