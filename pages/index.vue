<script lang="ts" setup>
import type { Note } from '@prisma/client';
import type { ExtendedNote } from '~/types/note';

const notes = ref<ExtendedNote[] | null>([])
const currentNote = ref<ExtendedNote | null>(null)
const currentNoteText = ref<string>('')
const currentNoteTitle = ref<string>('')
const isInitialSet = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

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
  currentNoteTitle.value = note.title
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
  nextTick(() => {
    isInitialSet.value = false
    textareaRef.value?.focus()
  })
}

const { handleError } = useErrorHandler()

// Debounced update function
const updateNote = useDebounceFn(async () => {
  if (!currentNote.value) return

  try {
    const updatedNote = await $fetch(`/api/notes/${currentNote.value.id}`, {
      method: 'PATCH',
      body: {
        text: currentNoteText.value,
        title: currentNoteTitle.value
      }
    })

    // Update the note in the local list
    if (notes.value) {
      notes.value = notes.value.map(note =>
        note.id === currentNote.value?.id
          ? {
            ...note,
            text: currentNoteText.value,
            title: currentNoteTitle.value,
            updatedAt: new Date(updatedNote.updatedAt),
            updatedDate: useDateFormat(updatedNote.updatedAt, 'YYYY-MM-DD').value
          }
          : note
      )
    }
  } catch (error) {
    handleError(error)
  }
}, 500)

// Watch for changes in note text
watch(currentNoteText, () => {
  if (currentNote.value && !isInitialSet.value) {
    updateNote()
  }
})

// Add title watch
watch(currentNoteTitle, () => {
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
    handleError(error)
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
    handleError(error)
  }
}
</script>

<template>
  <div class="flex h-screen">
    <div
      class="fixed z-10 h-screen shrink-0 overflow-hidden bg-neutral-100 transition-all duration-300 dark:bg-neutral-900 md:relative"
      :class="[
        isSidebarOpen ? 'w-[20rem]' : 'w-0',
      ]">
      <div class="flex h-full flex-col p-4">
        <div class="mb-4 flex flex-shrink-0 items-center justify-between">
          <Logo />
          <Settings />
        </div>
        <div class="overflow-y-auto">
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
    </div>


    <div class="flex flex-grow flex-col">
      <div class="flex items-center justify-between p-4">
        <UButton color="gray" variant="ghost"
          :icon="isSidebarOpen ? 'carbon:side-panel-close' : 'carbon:side-panel-open'" @click="toggleSidebar" />
        <UButton color="gray" variant="ghost" icon="carbon:pen-fountain" @click="createNote">
          New Note
        </UButton>
        <NoteSettings>
          <UButton :disabled="!currentNote" color="red" variant="ghost" icon="carbon:trash-can"
            @click="deleteNote(currentNote!.id)">Delete
          </UButton>
        </NoteSettings>
      </div>
      <div class="flex flex-grow justify-center p-6">
        <div class="flex w-full max-w-[30rem] flex-col">
          <div class="h-10 text-sm text-gray-400">{{ currentNote?.updatedDate }}</div>
          <input v-model="currentNoteTitle" class="mb-4 bg-transparent text-xl font-medium outline-none"
            placeholder="Untitled" />
          <textarea ref="textareaRef" v-model="currentNoteText"
            class="w-full flex-grow resize-none overflow-y-auto outline-none" placeholder="Start writing..."></textarea>
        </div>
      </div>
    </div>
    <div @click="toggleSidebar" v-if="isSidebarOpen"
      class="absolute bottom-0 left-0 right-0 top-0 bg-neutral-900/60 md:hidden"></div>
  </div>
</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>