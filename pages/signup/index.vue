<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { signupSchema, type SignupUser } from '~/types/schema'

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
    await $fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })
    toast.add({
      title: 'Success',
      description: 'Account created successfully',
      callback: () => router.push('/'),
      timeout: 1000
    })
  } catch (error: any) {
    handleError(error)
  }
}
</script>

<template>
  <NuxtLayout name="auth">
    <div class="my-4">
      <div>Create your account</div>
      <div class="text-sm text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-primary">Log in</NuxtLink>
      </div>
    </div>
    <UForm :schema="signupSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput size="md" type="email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput size="md" v-model="state.password" type="password" />
      </UFormGroup>
      <UButton type="submit">Sign up</UButton>
    </UForm>
  </NuxtLayout>
</template>