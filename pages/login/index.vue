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
    <div class="text-xl">Log in to your account</div>

    <OAuthProviders>
      <template #description>Connect to Nuxt Note with:</template>
    </OAuthProviders>

    <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput size="md" type="email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput size="md" v-model="state.password" type="password" />
      </UFormGroup>
      <UButton class="flex w-full justify-center" size="md" variant="outline" type="submit">Log in</UButton>
    </UForm>

    <div class="mt-6 text-sm text-gray-400">
      New to Neon?
      <NuxtLink to="/signup" class="text-primary">Sign up</NuxtLink>
      for an account
    </div>
  </NuxtLayout>
</template>