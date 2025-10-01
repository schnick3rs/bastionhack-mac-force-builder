<script setup lang="ts">

const { entry } = defineProps<{ entry: MAC }>()

import type {HardwareModule, MAC} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const module = ref('')

const { data: hardware, status } = await useFetch('/api/hardware', {
  key: 'typicode-users',
  transform: (data: HardwareModule[]) => {
    return data?.map(hardware => ({
      label: hardware.name,
      value: hardware.key,
      hint: hardware.effect,
    }))
  },
  lazy: true
})

const cost = computed(() => calculateMacCost(entry))

</script>

<template>

  <div class="font-light font-mono text-sm"># {{entry.id}}</div>

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="entry.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Class <UInput v-model="entry.class" class="w-12 mx-2" type="number" min="1" max="4" size="xs" ></UInput> MAC
  </h3>

  <h3 class="text-lg font-bold">Modules</h3>

  <UPageList>
    <UPageCard v-for="module in entry.modules" :key="module.slot" class="mb-2" orientation="horizontal">
      <UUser :avatar="{ text: `${module.slot}` }">
        <template #name>
          <span v-if="module.type === 'Weapon'">{{buildWeaponDisplayString(module.profile)}}</span>
          <span v-if="module.type === 'Hardware'">{{module.profile.name}}</span>
          <span v-if="module.type === 'Empty'">{{module.type}}</span>
        </template>
        <template #description>
          <WeaponProfileTooltips v-if="module.type === 'Weapon'" :weapon="module.profile" />
        </template>
      </UUser>
    </UPageCard>
  </UPageList>

  <USelectMenu
      v-model="module"
      :items="hardware"
      :loading="status === 'pending'"
      size="xl"
      class="hidden"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <div class="text-muted">
        {{ item.hint }}
      </div>
    </template>
  </USelectMenu>


</template>

<style scoped>

</style>