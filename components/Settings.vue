<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

async function handleLogout() {
  try {
    await $fetch('/api/logout', {
      method: 'POST'
    })
    userStore.clearUser()
    navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const toggleSort = () => {
  userStore.setSortPreference(userStore.sortBy === 'modified' ? 'created' : 'modified')
}
</script>

<template>
  <UPopover>
    <UButton variant="ghost" icon="carbon:settings" />
    <template #panel>
      <div class="w-60">
        <div class="p-4">
          <div class="text-sm font-medium leading-none">Account</div>
          <div v-if="userStore.user" class="mt-1 text-xs text-gray-500">
            {{ userStore.user.email }}
          </div>
        </div>
        <div class="flex flex-col p-1">
          <UButton variant="ghost" color="gray" icon="solar:sort-vertical-outline" @click="toggleSort">
            Sort by {{ userStore.sortBy === 'modified' ? 'modified' : 'created' }} date
          </UButton>
          <ThemeToggler></ThemeToggler>
          <UButton variant="ghost" icon="carbon:logout" color="red" @click="handleLogout">
            Log out
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>