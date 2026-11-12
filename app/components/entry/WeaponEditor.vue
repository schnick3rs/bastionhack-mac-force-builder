<script setup lang="ts">
import type {WeaponProfile} from "~~/types/unit";
import {useForcesStore} from "~/stores/forces";
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

// Reuse the name of an identical weapon already in the force, unless the user typed a custom name
const forcesStore = useForcesStore();
const route = useRoute();
const existingWeapons = computed<WeaponProfile[]>(() => {
  const force = forcesStore.forceById(route.params.forceId as string);
  const result: WeaponProfile[] = [];
  for (const e of force?.entries ?? []) {
    if (e.classification === 'MAC') {
      for (const m of e.modules) if (m.type === 'Weapon') result.push(m.profile);
    } else if (e.classification === 'Formation') {
      result.push(...(e.unit?.weapons ?? []));
    }
  }
  return result;
});

const brawlNames: Record<string, string> = { P: 'Piston', B: 'Blade', G: 'Grapple', M: 'Mower' }

let randomName = weapon.name;
function defaultName() {
  return weapon.range === '-' ? (brawlNames[weapon.type] ?? randomName) : randomName;
}
const nameCustomized = ref(false);

function regenerateName() {
  randomName = randomWeaponName();
  weapon.name = defaultName();
  nameCustomized.value = false;
}

watch(() => [weapon.range, weapon.type, weapon.power, weapon.subtype, weapon.expendable], () => {
  if (props.initialWeapon || nameCustomized.value) return;
  const range = rangeMap[weapon.range] ?? 'Brawl';
  const type = typeMap[weapon.type] ?? 'Burst';
  const subtype = subtypeMap[weapon.subtype];
  const power = range === 'Brawl' ? 2 : (Number(weapon.power) || 1);
  const match = existingWeapons.value.find(w =>
      w.range === range && w.type === type && w.power === power &&
      w.subtype === subtype && !!w.expendable === !!weapon.expendable);
  weapon.name = match ? match.name : defaultName();
}, { immediate: true });

function addWeapon() {
  let power = weapon.power || 1;
  if (weapon.range === '-') {
    power = 2;
  }

  const profile: WeaponProfile = {
    range: rangeMap[weapon.range] ?? "Brawl",
    type: typeMap[weapon.type] ?? "Burst",
    power:power,
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

    <UBadge v-if="weapon.range === '-'" color="neutral" variant="soft" >2</UBadge>
    <UBadge v-else-if="max === 1" color="neutral" variant="soft" >{{max}}</UBadge>
    <UInput v-else v-model="weapon.power" min="1" :max="max" type="number" ></UInput>

    <UBadge color="neutral" variant="soft">-</UBadge>
    <USelect class="w-1/4" v-model="weapon.subtype" :items="weaponSubtypes" value-key="value" ></USelect>
    <UCheckbox v-model="weapon.expendable" label="eXpendable" class="mt-3 px-2" color="info" size="sm"></UCheckbox>
  </UFieldGroup>

  <UFieldGroup orientation="horizontal">
    <UInput v-model="weapon.name" class="flex-1" @input="nameCustomized = true">
      <template #trailing>
        <UIcon name="i-material-symbols-light-autorenew"  class="cursor-pointer"  @click="regenerateName()" />
      </template>
    </UInput>
    <UButton color="info" variant="subtle" @click="addWeapon()" class="cursor-pointer" :disabled="disabled">{{ props.initialWeapon ? 'Save Changes' : 'Add Weapon' }}</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>