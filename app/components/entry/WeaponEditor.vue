<script setup lang="ts">
import type {WeaponProfile} from "~~/types/unit";
import {rangeMap, subtypeMap, typeMap} from "#shared/utils/weapons";

const { max, disabled } = defineProps({
  max: Number,
  disabled: Boolean,
})

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

const weapon = reactive({
  range: 'S',
  type: 'B',
  power: max,
  subtype: '',
  expendable: true,
  name: 'RandomLaser',
})

function addWeapon() {
  const profile: WeaponProfile = {
    range: rangeMap[weapon.range] ?? "Brawl",
    type: typeMap[weapon.type] ?? "Burst",
    power: weapon.power,
    expendable: !!weapon.expendable, // any expendable marker works
    subtype: subtypeMap[weapon.subtype],
    name: weapon.name
  }
  emit('addWeapon', profile)
}

</script>

<template>

  <UFieldGroup size="xl" orientation="horizontal">
    <USelect class="w-1/4" v-model="weapon.range" :items="weaponRangeItems" value-key="value" ></USelect>
    <USelect class="w-1/4" v-model="weapon.type" :items="weaponTypeItems" value-key="value" ></USelect>
    <UInput class="w-1/8" v-model="weapon.power" min="1" :max="max" type="number" ></UInput>
    <UCheckbox v-model="weapon.expendable" label="eXpendable" class="mt-2 px-2"></UCheckbox>
    <USelect class="w-1/4" v-model="weapon.subtype" :items="weaponSubtypes" value-key="value" ></USelect>
  </UFieldGroup>

  <UFieldGroup orientation="horizontal">
    <UInput v-model="weapon.name" class="flex-1"></UInput>
    <UButton color="info" variant="subtle" @click="addWeapon()" class="cursor-pointer" :disabled="disabled">Add Weapon</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>