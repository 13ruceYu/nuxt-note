<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { loginSchema, type LoginUser } from '~/types/schema'
import { useUserStore } from '~/store/user'

useHead({
  title: 'Log in'
})

const state = reactive({
  email: undefined,
  password: undefined
})

const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/github&scope=read:user,user:email`

const { handleError } = useErrorHandler()

async function onSubmit(event: FormSubmitEvent<LoginUser>) {
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(event.data),
    })
    const userStore = useUserStore()
    userStore.setUser(res)
    navigateTo('/')
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <div class="my-4">
      <div>Log in to your account</div>
      <div class="text-sm text-gray-400">
        Don't have a account?
        <NuxtLink to="/signup" class="text-primary">Sign up</NuxtLink>
        your account
      </div>
    </div>
    <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput size="md" type="email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput size="md" v-model="state.password" type="password" />
      </UFormGroup>
      <UButton type="submit">Log in</UButton>
    </UForm>
    <div class="mt-4 flex">
      <UButton icon="carbon:logo-github" color="gray" :to="githubOAuthUrl"></UButton>
    </div>
  </NuxtLayout>
</template>