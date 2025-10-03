<script setup lang="ts">
import type {Entry, HardwareProfile, MAC} from "~~/types/unit";
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

const cost = computed(() => calculateEntityCost(entry))

import hardware from "~~/server/data/hardwareRepository";

function tooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

function removeEntry(id: string) {
  console.info('removeEntry', id)
}

</script>

<template>


  <div class="flex flex-col items-center space-x-4 rtl:space-x-reverse">

    <div class="w-full flex gap-1">

      <div class="shrink-0">
        <UAvatar :icon="icon"size="xl"></UAvatar>
      </div>

      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
          <span v-if="entry.classification === 'Formation'">{{entry.size}}x </span>
          {{ name }}
        </p>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        {{cost}} pt
      </div>

      <div>
        <UButton icon="i-material-symbols-light-cancel" size="xl" color="error" variant="ghost" class="cursor-pointer w-fit" @click="removeEntry(entry.id)">

        </UButton>
      </div>

    </div>

    <div class="w-full">

      <template v-if="entry.classification === 'MAC'">

        <div class="flex flex-row gap-1 mt-2">
          <h4 class="font-bold ">Modules</h4>
          <div class="w-full border-b-1 ml-2" style="height: 1px; border-color: rgba(0,0,0, 0.2); top: 12px; position: relative;"></div>
        </div>
        <ul class="flex flex-wrap gap-2">
          <template v-for="weapon in entry.modules.filter(m => m.type === 'Weapon').map(m => m.profile)">
            <li>{{ buildWeaponDisplayString(weapon) }}</li> ⸱
          </template>
          <template v-for="(hardware, index) in entry.modules.filter(m => m.type === 'Hardware').map(m => m.profile)">
            <li style="text-decoration: underline dashed; text-underline-offset: 4px">{{ hardware.name }}</li>
            <span v-if="index < entry.modules.filter(m => m.type === 'Hardware').length -1"> ⸱ </span>
          </template>
        </ul>

      </template>

      <template v-if="entry.classification === 'Formation'">

        <div class="flex flex-row gap-1 mt-2">
          <h4 class="font-bold ">Modules</h4>
          <div class="w-full border-b-1 ml-2" style="height: 1px; border-color: rgba(0,0,0, 0.2); top: 12px; position: relative;"></div>
        </div>
        <ul class="flex flex-wrap gap-2">
          <template v-for="(weapon) in entry.unit.weapons">
            <li>{{ buildWeaponDisplayString(weapon) }}</li>
            <span> ⸱ </span>
          </template>

          <template v-for="(hardware, index) in entry.unit.hardware">
            <li style="text-decoration: underline dashed; text-underline-offset: 4px">{{ hardware.name }}</li>
            <span v-if="index < entry.unit.hardware.length -1"> ⸱ </span>
          </template>
        </ul>



      </template>

    </div>
  </div>

</template>

<style scoped>

</style>