<script lang="ts" setup>
import type { Note } from '@prisma/client';
import { useDateFormat } from '@vueuse/core';
import type { ExtendedNote } from '~/types/note';

const notes = ref<ExtendedNote[] | null>([])
const currentNote = ref<ExtendedNote | null>(null)

onMounted(async () => {
  const res = await $fetch<Note[]>('/api/notes')
  notes.value = res.map(note => {
    return {
      ...note,
      updatedDate: useDateFormat(note.updatedAt, 'YYYY-MM-DD').value,
    }
  })
})

const todayNotes = computed(() => {
  return notes.value?.filter(note => {
    const noteDate = new Date(note.createdAt)
    const today = new Date()
    return noteDate.toDateString() === today.toDateString()
  }) ?? []
})
const yesterdayNotes = computed(() => {
  return notes.value?.filter(note => {
    const noteDate = new Date(note.createdAt)
    const today = new Date()
    today.setDate(today.getDate() - 1)
    return noteDate.toDateString() === today.toDateString()
  }) ?? []
})
const earlierNotes = computed(() => {
  return notes.value?.filter(note => {
    const noteDate = new Date(note.createdAt)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return (noteDate.toDateString() !== yesterday.toDateString() && noteDate.toDateString() !== today.toDateString())
  }) ?? []
})



</script>

<template>
  <div class="flex h-screen">
    <div class="bg-black/50 w-[20rem] shrink-0 p-4">
      <Logo class="mb-4" />
      <div>
        <div class="mb-1" v-if="todayNotes.length">Today</div>
        <div>
          <NoteListItem v-for="note in todayNotes" :key="note.id" :note="note" @click="currentNote = note"
            :active="note.id === currentNote?.id">
          </NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="yesterdayNotes.length">Yesterday</div>
        <div>
          <NoteListItem v-for="note in yesterdayNotes" :key="note.id" :note="note" :active="note.id === currentNote?.id"
            @click="currentNote = note"></NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="earlierNotes.length">Earlier</div>
        <div>
          <NoteListItem v-for="note in earlierNotes" :key="note.id" :note="note" :active="note.id === currentNote?.id"
            @click="currentNote = note">
          </NoteListItem>
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <div class="flex justify-between items-center p-4">
        <UButton color="gray" variant="ghost" icon="carbon:document-add">Create Note
        </UButton>
        <u-button color="gray" variant="ghost" icon="carbon:trash-can"></u-button>
      </div>
      <div class="p-6 flex justify-center">
        <div>
          <div class="h-10 text-gray-600">{{ currentNote?.updatedDate }}</div>
          <div class="w-[30rem]">
            {{ currentNote?.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>