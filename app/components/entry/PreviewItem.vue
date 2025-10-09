<script setup lang="ts">
import type {Entry, HardwareProfile, MAC} from "~~/types/unit";
import {calculateEntityCost} from "#shared/utils/units";
import {buildWeaponDisplayString} from "#shared/utils/weapons";

const { entry } = defineProps<{ entry: Entry }>()

const emit = defineEmits(['removeEntry']);

const name = computed(() => {
  if (entry.classification === 'MAC') {
    return entry.name;
  }
  if (entry.classification === 'Formation') {
    return entry.unit.name;
  }
  if (entry.classification === 'Remote asset') {
    return entry.name;
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
  if (entry.classification === 'Remote asset') {
    return 'i-game-icons-anti-aircraft-gun';
  }
})

const description = computed(() => {
  if (entry.classification === 'MAC') {
    return `Class ${entry.class} MAC`;
  }
  if (entry.classification === 'Formation') {
    return `${entry.unit.type} Formation`;
  }
  if (entry.classification === 'Remote asset') {
    return entry.effect;
  }
})

const cost = computed(() => calculateEntityCost(entry))

import hardware from "~~/server/data/hardwareRepository";
import {reduceModules, convertToNiceware} from "#shared/utils/modules";

function tooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

function remove(id: string) {
  console.info('remove entry', id)
  emit('removeEntry', id);
}


const mergedPerkFlaws = computed(() => {
  const merged =  []
  if (entry.classification === 'MAC' && entry.perks) {
    if (entry.perks) {
      merged.push(...entry.perks)
    }
    if (entry.flaws) {
      merged.push(...entry.flaws)
    }
  }
  return merged;
})

</script>

<template>


  <div class="flex flex-col items-center space-x-4 rtl:space-x-reverse">

    <div class="w-full flex gap-1 justify-between items-center">

      <div class="pr-2">
        <UAvatar :icon="icon"size="3xl"></UAvatar>
      </div>

      <div class="flex-1">
        <p class=" font-medium text-gray-900 truncate dark:text-white">
          <span v-if="entry.classification === 'Formation'">{{entry.size}}x </span>
          {{ name }}
        </p>
        <p class="text-sm text-gray-500 truncate dark:text-gray-400 w-64">
          <span>{{ description }}</span>

          <template v-if="entry.classification === 'MAC' && entry.pilot">&nbsp;⸱&nbsp;
            <UTooltip :delay-duration="0" :text="entry.pilot.rookie ? 'Rookie Pilot' : entry.pilot.trick.effect">
              <span class="underline decoration-dotted" style="text-underline-offset: 4px">
                {{ entry.pilot.name }}
              </span>
            </UTooltip>
          </template>
        </p>
        <div class="text-sngle-line-ellipsis text-sm text-gray-500 dark:text-gray-400 w-64 pt-1">
          <template v-if="entry.classification === 'MAC' && mergedPerkFlaws">
            <template v-for="(feat, index) in mergedPerkFlaws">
              <UTooltip :delay-duration="0" :text="feat.effect" >
              <span class="underline decoration-dotted" style="text-underline-offset: 4px">
                {{ feat.name }}
              </span>
              </UTooltip>
              <span v-if="index < mergedPerkFlaws.length -1"> &nbsp;⸱&nbsp; </span>
            </template>

          </template>
        </div>
      </div>

      <div class="font-semibold text-gray-900 dark:text-white">
        {{cost}} pt
      </div>

      <div>
        <UButton
            icon="i-material-symbols-light-cancel-outline"
            size="xl"
            color="error"
            variant="ghost"
            class="cursor-pointer w-fit"
            @click.stop="remove(entry.id)"
        >
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
          <template v-for="redule in reduceModules(entry.modules.filter(m => m.type === 'Weapon')).filter(m => m.type === 'Weapon')">
            <li>
              <span v-if="redule.count > 1">{{redule.count}}x </span>
              {{ buildWeaponDisplayString(redule.profile) }}
            </li> ⸱
          </template>
          <template v-for="(hardware, index) in reduceModules(entry.modules.filter(m => m.type === 'Hardware'))">
            <li>
              <span v-if="hardware.count > 1">{{hardware.count}}x </span>
              <span class="underline decoration-dotted" style="text-underline-offset: 4px">{{ hardware.name }}</span>
            </li>
            <span v-if="index < convertToNiceware(entry.modules.filter(m => m.type === 'Hardware').map(m => m.profile)).length -1"> ⸱ </span>
          </template>
        </ul>

      </template>

      <template v-if="entry.classification === 'Formation'">

        <div class="flex flex-row gap-1 mt-2">
          <h4 class="font-bold ">Modules</h4>
          <div class="w-full border-b-1 ml-2" style="height: 1px; border-color: rgba(0,0,0, 0.1); top: 12px; position: relative;"></div>
        </div>
        <ul class="flex flex-wrap gap-2">
          <template v-for="(weapon) in entry.unit.weapons">
            <li>{{ buildWeaponDisplayString(weapon) }}</li>
            <span> ⸱ </span>
          </template>

          <template v-for="(hardware, index) in convertToNiceware(entry.unit.hardware)">
            <li>
              <span v-if="hardware.count > 1">2x </span>
              <span class="underline decoration-dotted" style="text-underline-offset: 4px">{{ hardware.name }}</span>
            </li>
            <span v-if="index < convertToNiceware(entry.unit.hardware).length -1"> ⸱ </span>
          </template>
        </ul>

      </template>

    </div>
  </div>

</template>
