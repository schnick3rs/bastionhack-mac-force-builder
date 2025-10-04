<script setup lang="ts">

import {getHardwareCatalogue} from "#shared/utils/modules";

const { entry, factionKey } = defineProps<{ entry: MAC, factionKey: string | undefined }>()

import type {MAC, ModuleConfig} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";

const cost = computed(() => calculateMacCost(entry))


function setSlotModule(slot: number, module: ModuleConfig) {
  console.info('setSlotModule', slot, module)
  entry.modules[slot] = module;
}

</script>

<template>


  <div class="flex gap-2 justify-between items-center font-bold">
    <UInput v-model="entry.name" class="" size="xl"></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 >
    Class <UInput v-model="entry.class" class="w-12 mx-2" type="number" min="1" max="3" ></UInput> MAC
  </h3>

  <h3 class="text-lg font-bold">Modules</h3>

  <UPageList>
    <UPageCard
        v-for="(module, index) in entry.modules"
        :key="module.slot" class="mb-2"
        orientation="vertical"
        :ui="{ container: 'sm:p-4' }"
    >

      <EntryMacSlotEditor :clazz="entry.class" :module="module" :factionKey="factionKey" @setModule="setSlotModule(module.slot, $event)"></EntryMacSlotEditor>

    </UPageCard>

  </UPageList>

</template>

<style scoped>

</style>