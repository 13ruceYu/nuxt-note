<script lang="ts" setup>

useHead({
  title: 'Log in'
})

const state = reactive({
  email: undefined,
  password: undefined
})

const router = useRouter()
const toast = useToast()

async function onSubmit() {
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(state)
    })
    toast.add({
      title: 'Success',
      description: 'Log in successfully',
      callback: () => router.push('/'),
      timeout: 1000
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.response._data.message,
      color: 'red',
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
          <div>Log in to your account</div>
          <div class="text-sm text-gray-400">Don't have a account? <NuxtLink to="/signup" class="text-primary">Sign up
            </NuxtLink> your account
          </div>
        </div>
        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput type="email" v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UButton type="submit">
            Log in
          </UButton>
        </UForm>
      </div>
    </div>
    <div class="bg-slate-900 flex flex-col justify-center items-center">
      hi
    </div>
  </div class="grid grid-cols-2 gap-4">
</template>