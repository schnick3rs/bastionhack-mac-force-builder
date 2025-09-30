<script setup lang="ts">

import {rangeHint, subtypeHint, typeHint} from "#shared/utils/weapons";

const { entry } = defineProps<{ entry: MAC }>()

import type {HardwareModule, MAC, WeaponRange, WeaponSubtype, WeaponType} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const weaponRangeItems = [
  { label: 'Brawl', value: '-', hint: 'Within melee'},
  { label: 'Short', value: 'S', hint: 'Max Range 12"'},
  { label: 'Long', value: 'L', hint: 'Min Range 6"'},
  { label: 'Arc', value: 'A', hint: 'Min Range 12, fire indirect"'},
]

const weaponTypeItems = [
  { label: 'Burst', value: 'B', hint: 'Reroll misses'},
  { label: 'Piercing', value: 'P', hint: 'Hits explode'},
  { label: 'Guided', value: 'G', hint: 'Use lowest Motionx2'},
  { label: 'Multi', value: 'M', hint: 'Attack 2nd target within 6" for 0 heat"'},
]

const powerItems = [
  { label: '1', value: '1', hint: 'Light cannons and guns' },
  { label: '2', value: '2', hint: 'Heavy mounted guns' },
  { label: '3', value: '3', hint: 'MAC-only weapons'},
  { label: '4', value: '4', hint: 'Largest MAC weapons'},
]

const weaponSubtypes = [
  { label: 'None', value: '-', hint: 'Just damage'},
  { label: 'Thermal', value: 'T', hint: 'Ignore Cover, cause heat'},
  { label: 'Jolt', value: 'J', hint: 'Jot deals ffamage on movement'},
  { label: 'Rad', value: 'R', hint: 'Deal damage then half Rad'},
]

const weapon = reactive({
  range: 'S',
  type: 'B',
  power: "2",
  subtype: '',
  expendable: true,
  name: 'RandomLaser',
})

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

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="entry.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Class <UInput v-model="entry.class" class="w-12 mx-2" type="number" min="1" max="4" size="xs" ></UInput> MAC
  </h3>

  <h3 class="text-lg font-bold">Modules</h3>

  <UPageList>
    <UPageCard v-for="module in entry.modules" :key="module.slot" class="mb-2">
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

  <hr>


  <USelectMenu
      v-model="module"
      :items="hardware"
      :loading="status === 'pending'"
      size="xl"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <div class="text-muted">
        {{ item.hint }}
      </div>
    </template>
  </USelectMenu>



  <UFieldGroup size="xl" orientation="horizontal">
    <USelect class="w-8" v-model="weapon.range" :items="weaponRangeItems" value-key="value" ></USelect>
    <USelect class="w-8" v-model="weapon.type" :items="weaponTypeItems" value-key="value" ></USelect>
    <USelect class="w-8" v-model="weapon.power" :items="powerItems" value-key="value" ></USelect>
    <USelect class="w-8" v-model="weapon.subtype" :items="weaponSubtypes" value-key="value" ></USelect>
  </UFieldGroup>

</template>

<style scoped>

</style>