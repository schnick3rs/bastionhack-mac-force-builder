<script setup lang="ts">
import type {Auxiliary, Formation, HardwareProfile, MAC, WeaponProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import {convertToNiceware, getHardwareCatalogue, type Niceware} from "#shared/utils/modules";
import {calcMaxWeaponPower} from "#shared/utils/units";

const { entry, factionKey } = defineProps<{ entry: Formation, factionKey: string | undefined }>()
const unit: Auxiliary = entry.unit;

const hardware = getHardwareCatalogue(factionKey)

const cost = computed(() => calculateFormationCost(entry));

const niceHardware = computed(() => convertToNiceware(unit.hardware));

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

function doubleHardware(hardwareName: string) {
  const h = hardware.find((h) => h.name === hardwareName);
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

  <div class="flex gap-2 justify-between items-center  font-bold">
    <UInput v-model="unit.name" size="xl"></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3>
    Size <UInput v-model="entry.size" class="w-12 mx-2" type="number" min="1" :max="entry.unit.type === 'Infantry' ? 5 : 3" ></UInput> {{unit.type}} Formation
  </h3>

  <div>
    <h3 class="text-2xl font-bold">Modules</h3>
    <p class="text-xs italic">AUs can carry any number of modules, but cannot have more than 2 weapons or more than 2 of the same hardware.</p>
  </div>

  <!-- WEAPONS -->

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
        </UUser>
      </div>

      <UButton icon="i-material-symbols-light-cancel-outline" color="error" variant="outline" class="cursor-pointer w-fit" @click="removeWeapon(index)">
        Remove
      </UButton>

    </UPageCard>
  </UPageList>

  <EntryWeaponEditor :max="calcMaxWeaponPower(entry)" @add-weapon="addWeapon" v-if="unit.weapons.length < 2"></EntryWeaponEditor>

  <!-- HARDWARE -->

  <h4 class="text-xl font-semibold">Hardware</h4>

  <div class="flex flex-wrap gap-2">
    <template v-for="(hardware, index) in niceHardware" :key="index" >

      <UBadge color="neutral" variant="subtle" size="xl">
        <UTooltip :delay-duration="0" :text="hardwareTooltip(hardware)">
          <span v-if="hardware.count > 1">2x </span>
          <span style="text-decoration: underline dashed; text-underline-offset: 4px">
            {{hardware.name}}
          </span>
        </UTooltip>
        <UIcon v-if="hardware.count <= 1" size="24" name="i-material-symbols-light-upload-2" color="error" class="ml-2 cursor-pointer bg-info" @click="doubleHardware(hardware.name)"></UIcon>
        <UIcon v-if="hardware.count > 1" size="24" name="i-material-symbols-light-download-2" color="error" class="ml-2 cursor-pointer bg-error" @click="removeHardware(hardware.name, index)"></UIcon>
        <UIcon size="24" name="i-material-symbols-light-cancel-outline" color="error" class="cursor-pointer bg-error" @click="removeHardware(hardware.name, index)"></UIcon>
      </UBadge>

    </template>
  </div>

  <UFieldGroup oientation="horizontal">
    <UBadge color="neutral" variant="subtle" @click="addHardware">Select to add Hardware</UBadge>
    <USelectMenu
        v-if="hardwareOptions"
        :items="hardwareOptions"
        value-key="name"
        label-key="name"
        class="flex-1"
        v-model="newModule"
        @change="addHardware"
    >
      <template #item-label="{ item }">
        {{ item.name }}
        <div class="text-muted">
          {{ item.effect }}
        </div>
      </template>
    </USelectMenu>


  </UFieldGroup>

</template>

<style scoped>

</style>