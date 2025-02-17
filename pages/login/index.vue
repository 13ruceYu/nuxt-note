<script setup lang="ts">
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
  <NuxtLayout name="auth">
    <div class="my-4">
      <div>Log in to your account</div>
      <div class="text-sm text-gray-400">
        Don't have a account?
        <NuxtLink to="/signup" class="text-primary">Sign up</NuxtLink>
        your account
      </div>
    </div>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput type="email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton type="submit">Log in</UButton>
    </UForm>
  </NuxtLayout>
</template>