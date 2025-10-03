<script setup lang="ts">
import {getHardwareCatalogue} from "#shared/utils/modules";

const { slot, factionKey } = defineProps<{ slot: number, factionKey: string | undefined }>()

const emit = defineEmits(['setModule'])

const hardware = getHardwareCatalogue(factionKey)

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