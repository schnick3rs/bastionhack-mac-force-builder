<script setup lang="ts">
  import {useForcesStore} from "~/stores/forces";
  import type {Entry, Force, HardwareModule} from "~~/types/unit";

  const forcesStore = useForcesStore();
  const route = useRoute();
  const forceId: string = route.params.forceId as string;
  const force: Force = forcesStore.forceById(forceId)

  function addMac() {
    forcesStore.addNewEntry(forceId, 'MAC');
  }
  function addVehicleFormation() {
    forcesStore.addNewEntry(forceId, 'Vehicle');
  }
  function addInfantryFormation() {
    forcesStore.addNewEntry(forceId, 'Infantry');
  }

</script>

<template>

  <h1>Build your force: {{ force.name }}</h1>

  <h2>Rooster</h2>

  <div class="grid grid-cols-2 gap-3">

    <div>

      <UPageList divide>
        <UPageCard v-for="entry in force?.entries" variant="ghost" :to="`/builder/${forceId}/entries/${entry.id}`">
          <EntryPreviewItem :entry="entry"></EntryPreviewItem>
        </UPageCard>

      </UPageList>

      <UButton @click="addMac">Add MAC</UButton>
      <UButton @click="addVehicleFormation">Add Vehicle Formation</UButton>
      <UButton @click="addInfantryFormation">Add Infantry Formation</UButton>

      <pre>
        {{ force.entries }}
      </pre>
    </div>

    <div>
      <NuxtPage/>
    </div>

  </div>





</template>

<style scoped>

</style>