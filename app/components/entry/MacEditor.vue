<script setup lang="ts">

const props = defineProps<{ entry: MAC }>()

import type {HardwareModule, MAC} from "~~/types/unit";

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

const weaponDisplayName = computed(() => {
  const {range, type, power, name } = weapon;
  const subtype = `${weapon.subtype}${weapon.expendable ? 'X' : ''}`
  return `${range}${type}${power}${!!subtype ? '-' : ''}${subtype} ${name}`;
})

const module = ref('')

const modules = reactive([
  { slot: 1, name: weaponDisplayName },
  { slot: 2, name: 'Aerodrive', description: 'Ignore terrain' },
  { slot: 3, name: 'some' },
  { slot: 4, name: 'some' },
  { slot: 5, name: 'some' },
  { slot: 6, name: 'some' },
])

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


const typeToIcon = {
  'MAC': 'i-game-icons-missile-mech',
  'Vehicle': 'i-game-icons-tank',
  'Infantry': 'i-game-icons-dark-squad',
}
</script>

<template>

  <h3>Class {{entry.class}} MAC</h3>

  <h3>Modules</h3>

  <UPageList>
    <UPageCard v-for="module in modules" class="mb-4">
      <UUser :name="module.name" :avatar="{ text: `${module.slot}` }" :description="module.description"></UUser>
      <UCheckbox label="Double Module"></UCheckbox>
    </UPageCard>
  </UPageList>

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

  <div>
    {{ weaponDisplayName }}
  </div>


  <UFieldGroup size="xl" orientation="horizontal">
    <USelect class="w-32" v-model="weapon.range" :items="weaponRangeItems" value-key="value" ></USelect>
    <USelect class="w-32" v-model="weapon.type" :items="weaponTypeItems" value-key="value" ></USelect>
    <USelect class="w-32" v-model="weapon.power" :items="powerItems" value-key="value" ></USelect>
    <USelect class="w-32" v-model="weapon.subtype" :items="weaponSubtypes" value-key="value" ></USelect>
  </UFieldGroup>
</template>

<style scoped>

</style>