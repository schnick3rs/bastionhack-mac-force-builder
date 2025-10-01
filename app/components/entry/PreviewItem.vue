<script setup lang="ts">
import type {Entry, HardwareModule, HardwareProfile, MAC} from "~~/types/unit";
import {calculateEntityCost} from "#shared/utils/units";
import {buildWeaponDisplayString} from "#shared/utils/weapons";

const { entry } = defineProps<{ entry: Entry }>()

const name = computed(() => {
  if (entry.classification === 'MAC') {
    return entry.name;
  }
  if (entry.classification === 'Formation') {
    return entry.unit.name;
  }
})

const icon = computed(() => {
  if (entry.classification === 'MAC') {
    return 'i-game-icons-missile-mech';
  }
  if (entry.classification === 'Formation') {
    if (entry.unit.type === 'Infantry') {
      return 'i-game-icons-dark-squad';
    }
    if (entry.unit.type === 'Vehicle') {
      return 'i-game-icons-tank';
    }
  }
})

const description = computed(() => {
  if (entry.classification === 'MAC') {
    return `Class ${entry.class} MAC`;
  }
  if (entry.classification === 'Formation') {
    return `${entry.unit.type} Formation`;
  }
})

const cost = computed(() => {
  return calculateEntityCost(entry)
})

const { data: hardware, status } = await useFetch('/api/hardware', { lazy: true });

function tooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.value?.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

</script>

<template>


  <div class="pb-3 sm:pb-4">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">

      <div class="shrink-0">
        <UAvatar :icon="icon"size="xl"></UAvatar>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          <span v-if="entry.classification === 'Formation'">{{entry.size}}x </span>
          {{ name }}
        </p>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          {{ description }}
        </p>

        <template v-if="entry.classification === 'Formation'">

          <template v-for="weapon in entry.unit.weapons.sort((a,b) => a.power - b.power)">
            <span class="text-xs pr-2" >{{ buildWeaponDisplayString(weapon) }}</span>
          </template>

          <template v-for="hardware in entry.unit.hardware.sort((a,b) => a.name.localeCompare(b.name))">
            <span class="text-xs pr-2" style="text-decoration: underline dashed; text-underline-offset: 4px">{{ hardware.name }}</span>
          </template>

        </template>

      </div>

      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        {{cost}} pt
      </div>

      <div>

      </div>
    </div>
  </div>

</template>

<style scoped>

</style>