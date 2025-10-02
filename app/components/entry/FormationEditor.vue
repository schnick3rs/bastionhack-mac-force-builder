<script setup lang="ts">
import type {Auxiliary, Formation, HardwareProfile, MAC, WeaponProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import {getHardwareCatalogue} from "#shared/utils/modules";

const { entry, factionKey } = defineProps<{ entry: Formation, factionKey: string | undefined }>()
const unit: Auxiliary = entry.unit;

const hardware = getHardwareCatalogue(factionKey)

const cost = computed(() => calculateFormationCost(entry))

function hardwareTooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

const hardwareOptions = computed(() => {
  if (!hardware) return [];
  return hardware
      .filter((h) => h.usability.includes(unit.type) || h.usability.includes('All'))
      .filter((h) => !unit.hardware.map(h => h.name).includes(h.name))
})

const newModule = ref('');

function addHardware() {
  const h = hardware.find((h) => h.name === newModule.value);
  if (!h) return;
  unit.hardware.push({ name: h.name });
  unit.hardware.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });
  newModule.value = '';
}

function removeHardware(name: string, index: number) {
  const weaponCount = unit.weapons.length
  unit.hardware.splice(index, 1);
}

function addWeapon(event: WeaponProfile) {
  console.info('addWeapon', event)
  unit.weapons.push(event);
  unit.weapons.sort((a, b) => {
    return a.power - b.power;
  });
}

function removeWeapon(index: number) {
  unit.weapons.splice(index, 1);
}

</script>

<template>

  <div class="font-light font-mono text-sm"># {{entry.id}}</div>

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="unit.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Size <UInput v-model="entry.size" class="w-12 mx-2" type="number" min="1" :max="entry.unit.type === 'Infantry' ? 5 : 3" size="xs" ></UInput> {{unit.type}} Formation
  </h3>

  <div>
    <h3 class="text-2xl font-bold">Modules</h3>
    <p class="text-xs italic">AUs can carry any number of modules, but cannot have more than 2 weapons or more than 2 of the same hardware.</p>
  </div>

  <h4 class="text-xl font-semibold">Weapons ({{unit.weapons.length}} of 2)</h4>

  <UPageList>
    <UPageCard v-for="(weapon, index) in unit.weapons" :key="index" class="mb-2" orientation="horizontal">
      <div>
        <UUser>
          <template #name>
            <span>{{buildWeaponDisplayString(weapon)}}</span>
          </template>
          <template #description>
            <WeaponProfileTooltips :weapon="weapon" />
          </template>
        </UUser></div>
      <UButton icon="i-material-symbols-light-cancel" color="error" variant="outline" class="cursor-pointer w-fit" @click="removeWeapon(index)">
        Remove
      </UButton>
    </UPageCard>
  </UPageList>

  <EntryWeaponEditor :auxiliaryType="unit.type" @add-weapon="addWeapon" :disabled="unit.weapons.length >= 2"></EntryWeaponEditor>

  <h4 class="text-xl font-semibold">Hardware</h4>

  <div class="flex flex-wrap gap-2">
    <template v-for="(hardware, index) in unit.hardware" :key="index" >
      <UBadge color="neutral" variant="subtle" size="xl">
        <UTooltip :delay-duration="0" :text="hardwareTooltip(hardware)">
          <span style="text-decoration: underline dashed; text-underline-offset: 4px">{{hardware.name}}</span>
        </UTooltip>
        <UIcon size="20" name="i-material-symbols-light-cancel" color="error" class="cursor-pointer" @click="removeHardware(hardware.name, index)"></UIcon>
      </UBadge>
    </template>
  </div>

  <UFieldGroup orientation="horizontal">
    <USelectMenu
        v-if="hardwareOptions"
        :items="hardwareOptions"
        value-key="name"
        label-key="name"
        class="flex-1"
        v-model="newModule"
    >
      <template #item-label="{ item }">
        {{ item.name }}
        <div class="text-muted">
          {{ item.effect }}
        </div>
      </template>
    </USelectMenu>

    <UButton variant="outline" @click="addHardware">Add Hardware</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>