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
  <div class="flex h-screen">
    <div class="bg-black/50 w-[20rem] shrink-0 p-4">
      <Logo class="mb-4"></Logo>
      <div>
        <div class="mb-2">Today</div>
        <div>
          <div class="px-4 py-3 rounded-lg hover:bg-primary/10 cursor-pointer" v-for="i in 3" :key="i">
            <div>Finally moved into my</div>
            <div class="text-sm flex">
              <div class="mr-4">Today</div>
              <div class="opacity-50 truncate">Life is like riding a bicycle. To keep your balance, you must keep
                moving.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <div class="flex justify-between items-center p-4">
        <UButton color="gray" variant="ghost" icon="carbon:document-add">Create Note
        </UButton>
        <u-button color="gray" variant="ghost" icon="carbon:trash-can"></u-button>
      </div>
      <div class="p-6 flex justify-center">
        <div>
          <div class="h-10 text-gray-600">Feb 15, 2025</div>
          <div class="w-[30rem]">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam culpa vero ipsam quia tempore animi
            excepturi
            eaque distinctio quis delectus aliquid eum placeat facilis id, maxime explicabo molestiae ut esse.
          </div>
        </div>
      </div>
    </div>
  </div>

</template>