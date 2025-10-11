<script setup lang="ts">
const { icon, title, description, cost = undefined, showDelete = false } = defineProps<{
  icon: string,
  title: string | undefined,
  description: string | undefined,
  cost: number | undefined,
  showDelete: boolean
}>()

const emit = defineEmits(['clickDelete'])

</script>

<template>
  <div class="w-full flex gap-1 justify-between items-center">

    <div class="pr-2">
      <UAvatar :icon="icon"size="3xl"></UAvatar>
    </div>

    <div class="flex-1">
      <p
          v-if="title"
         class=" font-medium text-gray-900 truncate dark:text-white"
      >
        {{ title }}
      </p>
      <p
          v-if="description"
          class="text-sm text-gray-500 truncate dark:text-gray-400 w-64"
      >
        <span>{{ description }}</span>
      </p>
    </div>

    <div
        v-if="cost"
        class="font-semibold text-gray-900 dark:text-white"
    >
      {{cost}} pt
    </div>

    <div>
      <UButton
          v-if="showDelete"
          icon="i-material-symbols-light-cancel-outline"
          size="xl"
          color="error"
          variant="ghost"
          class="cursor-pointer w-fit"
          @click.stop="emit('clickDelete')"
      >
      </UButton>
    </div>

  </div>
</template>

<style scoped>

</style>