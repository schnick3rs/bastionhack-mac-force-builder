<script setup lang="ts">
import type {WeaponRange, WeaponProfile, WeaponType, WeaponSubtype} from "~~/types/unit";
import {rangeHint, subtypeHint, typeHint} from "#shared/utils/weapons";

const { weapon } = defineProps<{ weapon: WeaponProfile }>();

const rangeDescription = (range: WeaponRange): string => rangeHint[range]
const typeDescription = (type: WeaponType): string => typeHint[type]
const expendableDescription = (): string => subtypeHint['Expendable']
const subtypeDescription = (subtype: WeaponSubtype): string => subtypeHint[subtype]

</script>

<template>
  <div>
    <UTooltip v-if="weapon.range" :delay-duration="0" :text="rangeDescription(weapon.range)">
      <span class="pr-2 underline decoration-dotted underline-offset-3">{{weapon.range}}</span>
    </UTooltip>
    <UTooltip v-if="weapon.type" :delay-duration="0" :text="typeDescription(weapon.type)">
      <span class="pr-2 underline decoration-dotted underline-offset-3">{{weapon.type}}</span>
    </UTooltip>
    <UTooltip v-if="weapon.subtype" :delay-duration="0" :text="subtypeDescription(weapon.subtype)">
      <span class="pr-2 underline decoration-dotted underline-offset-3">{{weapon.subtype}}</span>
    </UTooltip>
    <UTooltip v-if="weapon.expendable" :delay-duration="0" :text="expendableDescription()">
      <span class="pr-2 underline decoration-dotted underline-offset-3">Expendable</span>
    </UTooltip>
  </div>
</template>

<style scoped>

</style>