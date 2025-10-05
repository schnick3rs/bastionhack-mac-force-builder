<script setup lang="ts">
import type {WeaponProfile} from "~~/types/unit";
import {rangeMap, subtypeMap, typeMap} from "#shared/utils/weapons";

const props = defineProps<{
  max: number,
  disabled?: boolean,
  initialWeapon?: WeaponProfile
}>()

const emit = defineEmits(['addWeapon'])

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

const weaponSubtypes = [
  { label: 'None', value: '-', hint: 'Just damage'},
  { label: 'Thermal', value: 'T', hint: 'Ignore Cover, cause heat'},
  { label: 'Jolt', value: 'J', hint: 'Jot deals ffamage on movement'},
  { label: 'Rad', value: 'R', hint: 'Deal damage then half Rad'},
]

import { uniqueUsernameGenerator as gen } from 'unique-username-generator';

const prefix = ['Laser', 'Auto', 'Flare', 'Fusion', 'Heat', 'Rad', 'Shock'];
const suffix = ['Cannon', 'Carbine', 'Rifle', 'Launcher', 'Hammer', 'Repeater', 'Flak', 'Bombs', 'Missiles', 'Pod'];

function randomWeaponName() {
  return `${gen({dictionaries: [prefix], style: 'capital'})}${gen({dictionaries: [suffix], style: 'capital'})}`;
}

const weapon = reactive({
  range: 'S',
  type: 'B',
  power: props.max,
  subtype: '',
  expendable: false,
  name: randomWeaponName(),
})

function addWeapon() {
  const profile: WeaponProfile = {
    range: rangeMap[weapon.range] ?? "Brawl",
    type: typeMap[weapon.type] ?? "Burst",
    power: weapon.power || 1,
    expendable: !!weapon.expendable, // any expendable marker works
    subtype: subtypeMap[weapon.subtype],
    name: weapon.name
  }
  emit('addWeapon', profile)
}

watch(() => props.initialWeapon, (val) => {
  if (val) {
    console.info('An initial weapon as given', val);
    weapon.range = Object.keys(rangeMap).find(k => rangeMap[k] === val.range) ?? 'S'
    weapon.type = Object.keys(typeMap).find(k => typeMap[k] === val.type) ?? 'B'
    weapon.power = val.power
    weapon.subtype = Object.keys(subtypeMap).find(k => subtypeMap[k] === val.subtype) ?? ''
    weapon.expendable = val.expendable
    weapon.name = val.name
  }
}, { immediate: true })

</script>

<template>

  <UFieldGroup size="xl" orientation="horizontal">
    <USelect class="w-1/4" v-model="weapon.range" :items="weaponRangeItems" value-key="value" ></USelect>
    <USelect class="w-1/4" v-model="weapon.type" :items="weaponTypeItems" value-key="value" ></USelect>
    <UBadge v-if="max === 1" color="neutral" variant="soft" >{{max}}</UBadge>
    <UInput v-else v-model="weapon.power" min="1" :max="max" type="number" ></UInput>
    <UBadge color="neutral" variant="soft">-</UBadge>
    <USelect class="w-1/4" v-model="weapon.subtype" :items="weaponSubtypes" value-key="value" ></USelect>
    <UCheckbox v-model="weapon.expendable" label="eXpendable" class="mt-3 px-2" color="info" size="sm"></UCheckbox>
  </UFieldGroup>

  <UFieldGroup orientation="horizontal">
    <UInput v-model="weapon.name" class="flex-1" >
      <template #trailing>
        <UIcon name="i-material-symbols-light-autorenew"  class="cursor-pointer"  @click="weapon.name = randomWeaponName()" />
      </template>
    </UInput>
    <UButton color="info" variant="subtle" @click="addWeapon()" class="cursor-pointer" :disabled="disabled">{{ props.initialWeapon ? 'Save Changes' : 'Add Weapon' }}</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>