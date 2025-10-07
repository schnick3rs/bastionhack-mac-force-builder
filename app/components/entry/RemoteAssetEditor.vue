<script setup lang="ts">
import type {Auxiliary, Formation, HardwareProfile, MAC, WeaponProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import {convertToNiceware, getHardwareCatalogue} from "#shared/utils/modules";
import {calcMaxWeaponPower} from "#shared/utils/units";

const { entry } = defineProps<{ entry: RemoteAsset }>()

const cost = computed(() => (entry.cost || 0));

</script>

<template>

  <div class="flex gap-2 justify-between items-center  font-bold">
    <h1 class="text-xl">{{ entry.name }}</h1>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="italic">Remote Asset (see pg. 54-55)</h3>

  <p>{{ entry.effect }}</p>

</template>

<style scoped>

</style>