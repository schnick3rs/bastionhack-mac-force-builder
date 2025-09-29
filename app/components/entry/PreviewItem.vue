<script setup lang="ts">
import type {Entry, MAC} from "~~/types/unit";

const { entry } = defineProps<{ entry: Entry }>()

const name = computed(() => {
  if (entry.classification === 'MAC') {
    return entry.name;
  }
  if (entry.classification === 'Formation') {
    return entry.unit.name;
  }
})

const icon = computed(() => {
  if (entry.classification === 'MAC') {
    return 'i-game-icons-missile-mech';
  }
  if (entry.classification === 'Formation') {
    if (entry.unit.type === 'Infantry') {
      return 'i-game-icons-dark-squad';
    }
    if (entry.unit.type === 'Vehicle') {
      return 'i-game-icons-tank';
    }
  }
})

const description = computed(() => {
  if (entry.classification === 'MAC') {
    return `Class ${entry.class} MAC`;
  }
  if (entry.classification === 'Formation') {
    return `${entry.unit.type} Formation`;
  }
})

</script>

<template>
  <UUser :name="name" :description="description" :avatar="{ icon: icon }" size="xl"></UUser>
</template>

<style scoped>

</style>