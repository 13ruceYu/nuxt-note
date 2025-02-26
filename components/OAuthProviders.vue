<script setup lang="ts">
// Access environment variables via runtime config
const config = useRuntimeConfig()
const client_id = config.public.githubClientId
const appUrl = config.public.appUrl || 'http://localhost:3000'
const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${appUrl}/api/auth/github&scope=read:user,user:email`
</script>

<template>
  <div>
    <div class="my-2 text-sm text-gray-400">
      <slot name="description">Connect with:</slot>
    </div>

    <div class="mb-4 flex">
      <UButton size="md" class="flex w-full items-center justify-center" icon="carbon:logo-github" color="gray"
        :to="githubOAuthUrl">
        GitHub
      </UButton>
    </div>

    <UDivider :ui="{ label: 'text-gray-400' }" label="OR" />
  </div>
</template>
