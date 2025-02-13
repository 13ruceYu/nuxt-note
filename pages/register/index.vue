<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
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
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </div>
    </div>
    <div class="bg-slate-900 flex flex-col justify-center items-center">
      hi
    </div>
  </div class="grid grid-cols-2 gap-4">
</template>