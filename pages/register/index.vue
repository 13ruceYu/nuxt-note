<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { userSchema, type UserSchema } from '~/server/types/schema'

const state = reactive({
  email: undefined,
  password: undefined
})

const router = useRouter()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<UserSchema>) {
  try {
    const res = await $fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(event.data)
    })
    toast.add({
      title: 'Success',
      description: 'Account created successfully',
      callback: () => router.push('/')
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response._data.message,
      color: 'red'
    })
  }
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-screen">
    <div class="flex flex-col justify-center items-center px-4">
      <div>
        <h1 class="text-xl flex">
          <UIcon class="size-6 mr-1 text-primary" name="material-symbols:edit-square"></UIcon> Nuxt Note
        </h1>
        <div class="my-4">
          <div>Sign up for a free account</div>
          <div class="text-sm text-gray-400">Already registered? <NuxtLink to="/login" class="text-primary">Login in
            </NuxtLink> to your account
          </div>
        </div>
        <UForm :schema="userSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UButton type="submit">
            Sign up
          </UButton>
        </UForm>
      </div>
    </div>
    <div class="bg-slate-900 flex flex-col justify-center items-center">
      hi
    </div>
  </div class="grid grid-cols-2 gap-4">
</template>