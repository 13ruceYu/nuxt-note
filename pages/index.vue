<script lang="ts" setup>
const router = useRouter()

const handleSignOut = async () => {
  try {
    await $fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div>
    <u-button @click="handleSignOut">Sign out</u-button>
  </div>
  <h1 class="text-red-500">hi</h1>
</template>