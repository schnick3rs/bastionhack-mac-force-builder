<script setup lang="ts">

const { entry, factionKey } = defineProps<{ entry: MAC, factionKey: string | undefined }>()

import type {HardwareModule, MAC} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const cost = computed(() => calculateMacCost(entry))

function removeModule(index: number, slot: number) {
  entry.modules[index] = { slot: slot, type: 'Empty' };
}

function setSlotModule(slot: number, moduleName: string) {
  console.info('setSlotModule', slot, moduleName)
  entry.modules[slot - 1] = { slot: slot, type: 'Hardware', profile: { name: moduleName} };
}

</script>

<template>


  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="entry.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Class <UInput v-model="entry.class" class="w-12 mx-2" type="number" min="1" max="3" size="xs" ></UInput> MAC
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
          icon="i-material-symbols-light-cancel-outline"
          color="error"
          variant="outline"
          class="cursor-pointer w-fit"
          @click="removeModule(index, module.slot)">
        Remove
      </UButton>

      <template v-else-if="module.type === 'Empty'">

        <template v-if="module.slot > 3">
          <EntryMacSlotHardwareEditor :slot="module.slot" :factionKey="factionKey" @setModule="setSlotModule(module.slot, $event)" />
        </template>

        <UFieldGroup>
          <UButton
              v-if="module.slot <= 3"
              variant="outline"
              class="flex-1 cursor-pointer"
              @click="removeModule(index, module.slot)">
            Weapon
          </UButton>
          <UButton
              v-if="module.slot !== 1 && module.slot < 4"
              variant="outline"
              class="cursor-pointer"
              @click="removeModule(index, module.slot)">
             Hardware
          </UButton>
        </UFieldGroup>
      </template>

    </UPageCard>

  </UPageList>

</template>

<style scoped>

</style>