<script setup lang="ts">
import type { ExtendedNote } from '~/types/note';

const props = defineProps<{
  note: ExtendedNote,
  active?: boolean
}>()

</script>

<template>
  <div :class="['px-4 py-3 rounded-lg cursor-pointer', active ? 'bg-primary/60' : 'hover:bg-primary/20']">
    <div class="leading-none mb-2">{{ note.title || "Untitled" }}</div>
    <div class="text-xs flex opacity-50">
      <div class="mr-4 shrink-0">{{ note.updatedDate }}</div>
      <div class="truncate">{{ note.text }}</div>
    </div>
  </div>
</template>