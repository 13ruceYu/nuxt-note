<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { signupSchema, type SignupUser } from '~/types/schema'
import { useUserStore } from '~/store/user'

useHead({
  title: 'Sign up'
})

const state = reactive({
  email: undefined,
  password: undefined
})

const router = useRouter()
const toast = useToast()
const { handleError } = useErrorHandler()

async function onSubmit(event: FormSubmitEvent<SignupUser>) {
  try {
    const res = await $fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })

    // Set user in store and redirect
    const userStore = useUserStore()
    userStore.setUser(res)

    toast.add({
      title: 'Success',
      description: 'Account created successfully',
      timeout: 2000
    })

    router.push('/')
  } catch (error: any) {
    handleError(error)
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <div class="text-xl">Create your account</div>

    <OAuthProviders>
      <template #description>Sign up for Nuxt Note with:</template>
    </OAuthProviders>

    <UForm :schema="signupSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput size="md" type="email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput size="md" v-model="state.password" type="password" />
      </UFormGroup>
      <UButton class="flex w-full justify-center" size="md" variant="outline" type="submit">Sign up</UButton>
    </UForm>

    <div class="mt-6 text-sm text-gray-400">
      Already have an account?
      <NuxtLink to="/login" class="text-primary">Log in</NuxtLink>
    </div>
  </NuxtLayout>
</template>