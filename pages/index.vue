<script lang="ts" setup>
import type { Note } from '@prisma/client';
import { useDateFormat } from '@vueuse/core';
import type { ExtendedNote } from '~/types/note';
import { useDebounceFn } from '@vueuse/core';

const notes = ref<ExtendedNote[] | null>([])
const currentNote = ref<ExtendedNote | null>(null)
const currentNoteText = ref<string>('')
const isInitialSet = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

onMounted(async () => {
  const res = await $fetch<Note[]>('/api/notes')
  notes.value = res.map(note => {
    return {
      ...note,
      updatedDate: useDateFormat(note.updatedAt, 'YYYY-MM-DD').value,
    }
  })
})

const filterNotesByDate = (daysAgo: number = 2) => {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() - daysAgo)
  return notes.value?.filter(note => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() === targetDate.toDateString()
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) ?? []
}

const todayNotes = computed(() => filterNotesByDate(0))
const yesterdayNotes = computed(() => filterNotesByDate(1))
const earlierNotes = computed(() => filterNotesByDate())

function setCurrentNote(note: ExtendedNote) {
  isInitialSet.value = true
  currentNote.value = note
  currentNoteText.value = note.text
  nextTick(() => {
    isInitialSet.value = false
    textareaRef.value?.focus()
  })
}

// Debounced update function
const updateNote = useDebounceFn(async () => {
  if (!currentNote.value) return

  try {
    const updatedNote = await $fetch(`/api/notes/${currentNote.value.id}`, {
      method: 'PATCH',
      body: {
        text: currentNoteText.value
      }
    })

    // Update the note in the local list
    if (notes.value) {
      notes.value = notes.value.map(note =>
        note.id === currentNote.value?.id
          ? {
            ...note,
            text: currentNoteText.value,
            updatedAt: new Date(updatedNote.updatedAt),
            updatedDate: useDateFormat(updatedNote.updatedAt, 'YYYY-MM-DD').value
          }
          : note
      )
    }
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

async function deleteNote(noteId: number) {
  if (!confirm('Are you sure you want to delete this note?')) return

  try {
    await $fetch(`/api/notes/${noteId}`, {
      method: 'DELETE'
    })

    // Remove note from local state
    notes.value = notes.value?.filter(note => note.id !== noteId) ?? []

    // Clear current note if it was deleted
    if (currentNote.value?.id === noteId) {
      currentNote.value = null
      currentNoteText.value = ''
    }
  } catch (error) {
    console.error('Failed to delete note:', error)
  }
}
</script>

<template>
  <div class="flex h-screen">
    <div class="bg-neutral-100 dark:bg-neutral-900 w-[20rem] shrink-0 p-4">
      <div class="flex justify-between items-center mb-4">
        <Logo />
        <Settings></Settings>
      </div>
      <div>
        <div class="mb-1" v-if="todayNotes.length">Today</div>
        <div>
          <NoteListItem class="mb-1" v-for="note in todayNotes" :key="note.id" :note="note"
            @click="setCurrentNote(note)" :active="note.id === currentNote?.id">
          </NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="yesterdayNotes.length">Yesterday</div>
        <div>
          <NoteListItem class="mb-1" v-for="note in yesterdayNotes" :key="note.id" :note="note"
            :active="note.id === currentNote?.id" @click="setCurrentNote(note)"></NoteListItem>
        </div>
        <div class="mb-1 mt-4" v-if="earlierNotes.length">Earlier</div>
        <div>
          <NoteListItem class="mb-1" v-for="note in earlierNotes" :key="note.id" :note="note"
            :active="note.id === currentNote?.id" @click="setCurrentNote(note)">
          </NoteListItem>
        </div>
      </div>
    </div>
    <div class="flex-grow flex flex-col">
      <div class="flex justify-between items-center p-4">
        <UButton color="gray" variant="ghost" icon="carbon:document-add" @click="createNote">
          Create Note
        </UButton>
        <UButton v-if="currentNote" color="red" variant="ghost" icon="carbon:trash-can"
          @click="deleteNote(currentNote.id)">
        </UButton>
      </div>
      <div class="p-6 flex justify-center flex-grow">
        <div class="flex flex-col w-full max-w-[30rem]">
          <div class="h-10 text-gray-600">{{ currentNote?.updatedDate }}</div>
          <textarea ref="textareaRef" v-model="currentNoteText" class="w-full flex-grow outline-none resize-none"
            placeholder="start writing first..."></textarea>
        </div>
      </div>
    </div>
  </div>
</template>