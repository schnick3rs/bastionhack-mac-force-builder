<script setup lang="ts">
import type {Auxiliary, Formation, HardwareProfile, MAC, WeaponProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import {convertToNiceware, getHardwareCatalogue} from "#shared/utils/modules";
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

const hardwareModalOpen = ref(false);

function addHardware(name: string) {
  const h = hardware.find((h) => h.name === name);
  if (!h) return;
  unit.hardware.push({ name: h.name });
  unit.hardware.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });
}

function doubleHardware(hardwareName: string) {
  const h = hardware.find((h) => h.name === hardwareName);
  if (!h) return;
  unit.hardware.push({ name: h.name });
  unit.hardware.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });
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

const initialWeapon = ref<WeaponProfile>();

function removeWeapon(index: number) {
  const oldWeapon = unit.weapons.splice(index, 1);
  initialWeapon.value = oldWeapon[0]
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
    <UPageCard
        v-for="(weapon, index) in unit.weapons"
        :key="index"
        class="mb-2"
        orientation="vertical"
        :ui="{ container: 'p-2' }"
    >

      <div class="w-full flex gap-1 justify-between items-center">

        <UUser :ui="{ wrapper: 'flex-1'}">
          <template #name>
            <span>{{buildWeaponDisplayString(weapon)}}</span>
          </template>
          <template #description>
            <WeaponProfileTooltips :weapon="weapon" />
          </template>
        </UUser>

        <div>

          <UButton
              icon="i-material-symbols-light-edit"
              color="info"
              variant="ghost"
              class="cursor-pointer w-fit"
              @click="removeWeapon(index)"
              title="Remove Weapon from Unit"
          >
          </UButton>

          <UButton
              icon="i-material-symbols-light-cancel-outline"
              color="error"
              variant="ghost"
              class="cursor-pointer w-fit"
              @click="removeWeapon(index)"
              title="Remove Weapon from Unit"
          >
          </UButton>
        </div>
      </div>

    </UPageCard>
  </UPageList>

  <!-- edit an existing weapon -->

  <!-- add a new eapon -->
  <EntryWeaponEditor
      v-if="unit.weapons.length < 2"
      :initial-weapon="initialWeapon"
      :max="calcMaxWeaponPower(entry)"
      @add-weapon="addWeapon"
  ></EntryWeaponEditor>

  <!-- HARDWARE -->

  <h4 class="text-xl font-semibold">Hardware</h4>

  <div class="flex flex-wrap gap-2">
    <template v-for="(hardware, index) in niceHardware" :key="index" >

      <UBadge color="neutral" variant="subtle" size="xl">
        <UTooltip :delay-duration="0" :text="hardwareTooltip(hardware)">
          <span v-if="hardware.count > 1">2x </span>
          <span class="underline decoration-dotted" style="text-underline-offset: 4px">
            {{hardware.name}}
          </span>
        </UTooltip>
        <UIcon v-if="hardware.count <= 1" size="24" name="i-material-symbols-light-upload-2" color="error" class="ml-2 cursor-pointer bg-info" @click="doubleHardware(hardware.name)"></UIcon>
        <UIcon v-if="hardware.count > 1" size="24" name="i-material-symbols-light-download-2" color="error" class="ml-2 cursor-pointer bg-error" @click="removeHardware(hardware.name, index)"></UIcon>
        <UIcon size="24" name="i-material-symbols-light-cancel-outline" color="error" class="cursor-pointer bg-error" @click="removeHardware(hardware.name, index)"></UIcon>
      </UBadge>

    </template>
    <UButton
        color="info"
        variant="outline"
        size="xl"
        class="cursor-pointer"
        @click="hardwareModalOpen = true"
    >
      + Hardware
    </UButton>
  </div>

  <EntryHardwareSelectModal
      v-model:open="hardwareModalOpen"
      :items="hardwareOptions"
      :factionKey="factionKey"
      @select="addHardware"
  />

</template>

<style scoped>

</style>