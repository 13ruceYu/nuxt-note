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
</script>

<template>
  <UPopover>
    <UButton variant="ghost" icon="carbon:settings" />
    <template #panel>
      <div class="w-60">
        <div class="p-4">
          <div class="text-sm font-medium leading-none">Account</div>
          <div v-if="userStore.user" class="text-xs text-gray-500 mt-1">
            {{ userStore.user.email }}
          </div>
        </div>
        <div class="p-1 flex flex-col">
          <ThemeToggler></ThemeToggler>
          <UButton variant="ghost" icon="carbon:logout" color="red" class="justify-start" @click="handleLogout">
            Log out
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>