<script lang="ts" setup>
import type { Note } from '@prisma/client';
import { useDateFormat } from '@vueuse/core';
import type { ExtendedNote } from '~/types/note';
import { useDebounceFn } from '@vueuse/core';

const notes = ref<ExtendedNote[] | null>([])
const currentNote = ref<ExtendedNote | null>(null)
const currentNoteText = ref<string>('')
const isInitialSet = ref(false)

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
    const noteDate = new Date(note.updatedAt)
    const today = new Date()
    return noteDate.toDateString() === today.toDateString()
  }) ?? []
})
const yesterdayNotes = computed(() => {
  return notes.value?.filter(note => {
    const noteDate = new Date(note.updatedAt)
    const today = new Date()
    today.setDate(today.getDate() - 1)
    return noteDate.toDateString() === today.toDateString()
  }) ?? []
})
const earlierNotes = computed(() => {
  return notes.value?.filter(note => {
    const noteDate = new Date(note.updatedAt)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return (noteDate.toDateString() !== yesterday.toDateString() && noteDate.toDateString() !== today.toDateString())
  }) ?? []
})

function setCurrentNote(note: ExtendedNote) {
  isInitialSet.value = true
  currentNote.value = note
  currentNoteText.value = note.text
  nextTick(() => {
    isInitialSet.value = false
  })
}

// Debounced update function
const updateNote = useDebounceFn(async () => {
  if (!currentNote.value) return

  try {
    await $fetch(`/api/notes/${currentNote.value.id}`, {
      method: 'PATCH',
      body: {
        text: currentNoteText.value
      }
    })
  } catch (error) {
    console.error('Failed to update note:', error)
  }
}, 500)

// Watch for changes in note text
watch(currentNoteText, () => {
  if (currentNote.value && !isInitialSet.value) {
    updateNote()
  }
})

// Add createNote
async function createNote() {
  try {
    const note = await $fetch<Note>('/api/notes', {
      method: 'POST'
    })

    // Add updatedDate to the new note
    const extendedNote: ExtendedNote = {
      ...note,
      updatedDate: useDateFormat(note.updatedAt, 'YYYY-MM-DD').value
    }

    // Add to notes list
    notes.value = [extendedNote, ...(notes.value ?? [])]

    // Set as current note
    setCurrentNote(extendedNote)
  } catch (error) {
    console.error('Failed to create note:', error)
  }
}
</script>

<template>
  <div class="flex h-screen">
    <div class="bg-black/50 w-[20rem] shrink-0 p-4">
      <Logo class="mb-4" />
      <div>
        <div class="mb-1" v-if="todayNotes.length">Today</div>
        <div>
          <NoteListItem v-for="note in todayNotes" :key="note.id" :note="note" @click="setCurrentNote(note)"
            :active="note.id === currentNote?.id">
          </NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="yesterdayNotes.length">Yesterday</div>
        <div>
          <NoteListItem v-for="note in yesterdayNotes" :key="note.id" :note="note" :active="note.id === currentNote?.id"
            @click="setCurrentNote(note)"></NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="earlierNotes.length">Earlier</div>
        <div>
          <NoteListItem v-for="note in earlierNotes" :key="note.id" :note="note" :active="note.id === currentNote?.id"
            @click="setCurrentNote(note)">
          </NoteListItem>
        </div>
      </div>
    </div>
    <div class="flex-grow flex flex-col">
      <div class="flex justify-between items-center p-4">
        <UButton color="gray" variant="ghost" icon="carbon:document-add" @click="createNote">
          Create Note
        </UButton>
        <u-button color="gray" variant="ghost" icon="carbon:trash-can"></u-button>
      </div>
      <div class="p-6 flex justify-center flex-grow">
        <div class="flex flex-col">
          <div class="h-10 text-gray-600">{{ currentNote?.updatedDate }}</div>
          <textarea v-model="currentNoteText" class="w-[30rem] flex-grow outline-none resize-none border"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>