<script lang="ts" setup>
async function handleLogout() {
  try {
    await $fetch('/api/logout', {
      method: 'POST'
    })
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
      <div class="w-60 p-2">
        <div class="px-3">Account</div>
        <div class="flex flex-col">
          <ThemeToggler></ThemeToggler>
          <UButton variant="ghost" icon="carbon:logout" color="gray" class="justify-start" @click="handleLogout">
            Log out
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>