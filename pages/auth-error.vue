<script lang="ts" setup>
const route = useRoute();
const errorMessage = computed(() => route.query.message || 'Authentication failed');
const statusCode = computed(() => route.query.status || '500');

// Auto-redirect after 10 seconds
const countdown = ref(10);
const router = useRouter();

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push('/login');
    }
  }, 1000);

  // Clear timer on component unmount
  onUnmounted(() => {
    clearInterval(timer);
  });
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
      <div class="mb-6 text-center">
        <UIcon name="carbon:warning" class="mx-auto mb-4 h-16 w-16 text-amber-500" />
        <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Authentication Error</h1>
        <div class="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Error {{ statusCode }}: {{ errorMessage }}
        </div>
      </div>

      <div class="space-y-4">
        <UButton to="/login" block color="primary" icon="carbon:arrow-left">
          Return to Login
        </UButton>

        <div class="text-center text-sm text-gray-600 dark:text-gray-300">
          Redirecting to login page in {{ countdown }} seconds...
        </div>
      </div>
    </div>
  </div>
</template>
