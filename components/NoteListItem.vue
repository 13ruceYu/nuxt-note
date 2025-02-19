<script setup lang="ts">
import type { ExtendedNote } from '~/types/note';

const props = defineProps<{
  note: ExtendedNote,
  active?: boolean
}>()

</script>

<template>
  <div class="p-3 md:p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
    :class="{ 'bg-gray-200 dark:bg-neutral-800': active }" @click="$emit('click')">
    <div class="text-base truncate">
      {{ note.title || 'Untitled' }}
    </div>
    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
      {{ note.text || 'No content' }}
    </div>
  </div>
</template>