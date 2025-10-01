<script setup lang="ts">

const { entry } = defineProps<{ entry: MAC }>()

import type {HardwareModule, MAC} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const cost = computed(() => calculateMacCost(entry))

function removeModule(index: number, slot: number) {
  entry.modules[index] = { slot: slot, type: 'Empty' };
}

import hardware from "~~/server/data/hardwareRepository";

const hardwareOptions = computed(() => {
  if (!hardware) return [];
  return hardware.filter((h) => h.usability.includes('MAC') || h.usability.includes('All'))
})

</script>

<template>

  <div class="font-light font-mono text-sm"># {{entry.id}}</div>

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="entry.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Class <UInput v-model="entry.class" class="w-12 mx-2" type="number" min="1" max="4" size="xs" ></UInput> MAC
  </h3>

  <h3 class="text-lg font-bold">Modules</h3>

  <UPageList>
    <UPageCard v-for="(module, index) in entry.modules" :key="module.slot" class="mb-2" orientation="horizontal">
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
      <UButton
          v-if="module.type !== 'Empty'"
          icon="i-material-symbols-light-cancel"
          color="error"
          variant="outline"
          class="cursor-pointer w-fit"
          @click="removeModule(index, module.slot)">
        Remove
      </UButton>
      <template v-else-if="module.type === 'Empty'">
        <UFieldGroup>
          <UButton
              variant="outline"
              class="cursor-pointer"
              @click="removeModule(index, module.slot)">
             Hardware
          </UButton>
          <UButton
              variant="outline"
              class="cursor-pointer"
              @click="removeModule(index, module.slot)">
             Weapon
          </UButton>
        </UFieldGroup>
      </template>
    </UPageCard>
  </UPageList>

</template>

<style scoped>

</style>