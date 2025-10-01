<script setup lang="ts">
const { slot } = defineProps<{ slot: number }>()

const emit = defineEmits(['setModule'])

import hardware from "~~/server/data/hardwareRepository";

const hardwareOptions = computed(() => {
  if (!hardware) return [];
  return hardware.filter((h) => h.usability.includes('MAC') || h.usability.includes('All'))
})

const hardwareModule = ref('')

</script>

<template>

  <USelectMenu
      v-if="hardwareOptions"
      v-model="hardwareModule"
      :items="hardwareOptions"
      value-key="name"
      label-key="name"
      color="success"
      @change="emit('setModule', hardwareModule)"
  >
    <template #item-label="{ item }">
      {{ item.name }}
      <div class="text-muted">
        {{ item.effect }}
      </div>
    </template>
  </USelectMenu>
</template>

<style scoped>

</style>