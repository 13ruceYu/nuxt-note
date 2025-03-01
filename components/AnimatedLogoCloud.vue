<template>
  <div class="w-full pt-6 md:py-12">
    <div class="flex w-full flex-col items-center justify-center gap-6 px-4 md:px-8">
      <div v-if="props.title" class="text-muted-foreground font-medium">
        {{ props.title }}
      </div>
      <div :class="cn('grid grid-cols-5', props.class)">
        <Icon v-for="(logo, key) in props.logos" :key="key" :name="logo.path" :alt="logo.name"
          class="h-7 w-12 px-2 brightness-0 dark:invert" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from "~/lib/utils";

interface Logo {
  name: string;
  path: string;
}
export interface AnimateLogoCloudProps {
  class?: string;
  title?: string;
  logos?: Logo[];
}

const props = defineProps<AnimateLogoCloudProps>();
</script>