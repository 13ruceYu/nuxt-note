<script lang="ts" setup>
import type { Note } from '@prisma/client';
import { useUserStore } from '~/store/user';
import type { ExtendedNote } from '~/types/note';

const notes = ref<ExtendedNote[] | null>([])
const currentNote = ref<ExtendedNote | null>(null)
const currentNoteText = ref<string>('')
const currentNoteTitle = ref<string>('')
const isInitialSet = ref(false)
const isInfoOpen = ref(false)
const titleRef = ref<HTMLInputElement | null>(null)

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(async () => {
  const res = await $fetch<Note[]>('/api/notes')
  notes.value = res.map(note => {
    return {
      ...note,
      updatedDate: useDateFormat(note.updatedAt, 'YYYY-MM-DD HH:mm:ss').value,
    }
  })
})

const userStore = useUserStore()

const sortNotes = (notesToSort: ExtendedNote[]) => {
  return [...notesToSort].sort((a, b) => {
    const dateA = userStore.sortBy === 'modified' ? new Date(b.updatedAt) : new Date(b.createdAt)
    const dateB = userStore.sortBy === 'modified' ? new Date(a.updatedAt) : new Date(a.createdAt)
    return dateA.getTime() - dateB.getTime()
  })
}

const filterNotesByDate = (daysAgo: number = 2, isEarlier: boolean = false) => {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() - daysAgo)

  const filtered = notes.value?.filter(note => {
    const noteDate = new Date(userStore.sortBy === 'modified' ? note.updatedAt : note.createdAt)
    if (isEarlier) {
      // For earlier notes, get notes older than 2 days
      return noteDate < new Date(new Date().setDate(new Date().getDate() - 2))
    }
    return noteDate.toDateString() === targetDate.toDateString()
  }) ?? []

  return sortNotes(filtered)
}

const todayNotes = computed(() => filterNotesByDate(0))
const yesterdayNotes = computed(() => filterNotesByDate(1))
const earlierNotes = computed(() => filterNotesByDate(2, true))

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
            ...updatedNote,
            text: currentNoteText.value,
            title: currentNoteTitle.value,
            createdAt: new Date(updatedNote.createdAt),
            updatedAt: new Date(updatedNote.updatedAt),
            updatedDate: useDateFormat(updatedNote.updatedAt, 'YYYY-MM-DD HH:mm:ss').value
          }
          : note
      )
      currentNote.value.updatedDate = useDateFormat(updatedNote.updatedAt, 'YYYY-MM-DD HH:mm:ss').value
    }
  } catch (error) {
    handleError(error)
  }
}, 500)

const handleAutoCreate = useDebounceFn(async () => {
  if (!currentNote.value && (currentNoteText.value || currentNoteTitle.value)) {
    await createNote()
    // Update the newly created note with the input values
    updateNote()
  }
}, 500)

watch(currentNoteText, (newValue) => {
  if (newValue && !currentNote.value) {
    handleAutoCreate()
  } else if (currentNote.value && !isInitialSet.value) {
    updateNote()
  }
})

watch(currentNoteTitle, (newValue) => {
  if (newValue && !currentNote.value) {
    handleAutoCreate()
  } else if (currentNote.value && !isInitialSet.value) {
    updateNote()
  }
})

async function createNote(options?: { clickNewNote?: boolean }) {
  if (options?.clickNewNote) {
    currentNote.value = null
    currentNoteText.value = ''
    currentNoteTitle.value = ''
    nextTick(() => {
      titleRef.value?.focus()
    })
  }

  try {
    const note = await $fetch<Note>('/api/notes', {
      method: 'POST',
      body: {
        text: currentNoteText.value,
        title: currentNoteTitle.value
      }
    })

    const extendedNote: ExtendedNote = {
      ...note,
      updatedDate: useDateFormat(note.updatedAt, 'YYYY-MM-DD HH:mm:ss').value
    }

    notes.value = [extendedNote, ...(notes.value ?? [])]
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
          <div class="mb-1 text-gray-400" v-if="todayNotes.length">Today</div>
          <div>
            <NoteListItem class="mb-1" v-for="note in todayNotes" :key="note.id" :note="note"
              @click="setCurrentNote(note)" :active="note.id === currentNote?.id">
            </NoteListItem>
          </div>
          <div class="mb-1 mt-4 text-gray-400" v-if="yesterdayNotes.length">Yesterday</div>
          <div>
            <NoteListItem class="mb-1" v-for="note in yesterdayNotes" :key="note.id" :note="note"
              :active="note.id === currentNote?.id" @click="setCurrentNote(note)"></NoteListItem>
          </div>
          <div class="mb-1 mt-4 text-gray-400" v-if="earlierNotes.length">Earlier</div>
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
        <UButton color="gray" variant="ghost" icon="carbon:pen-fountain" @click="createNote({ clickNewNote: true })">
          New Note
        </UButton>
        <NoteSettings>
          <UButton :disabled="!currentNote" @click="isInfoOpen = !isInfoOpen" color="gray" variant="ghost"
            icon="carbon:information">Detail</UButton>
          <UModal v-model="isInfoOpen">
            <div class="p-4">
              <div class="text-lg font-medium">Title: {{ currentNote?.title || 'Untitled' }}</div>
              <div class="text-sm text-gray-500">Created Date: {{ useDateFormat(currentNote?.createdAt, `YYYY-MM-DD
                HH:mm:ss`) }}</div>
              <div class="text-sm text-gray-500">Updated Date: {{ currentNote?.updatedDate }}</div>
            </div>
          </UModal>
          <UButton :disabled="!currentNote" color="red" variant="ghost" icon="carbon:trash-can"
            @click="deleteNote(currentNote!.id)">Delete
          </UButton>
        </NoteSettings>
      </div>
      <div class="flex flex-grow justify-center p-6">
        <div class="flex w-full max-w-[30rem] flex-col">
          <input ref="titleRef" v-model="currentNoteTitle" class="mb-4 bg-transparent text-xl font-medium outline-none"
            placeholder="Start typing title..." />
          <textarea v-model="currentNoteText" class="w-full flex-grow resize-none overflow-y-auto outline-none"
            placeholder="Start writing..."></textarea>
          <div class="text-xs text-gray-400">
            {{ currentNote ? currentNote.updatedDate : '' }}
          </div>
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