<script setup lang="ts">
  import {useForcesStore} from "~/stores/forces";
  import type {Entry, Force, HardwareModule} from "~~/types/unit";
  import {calculateEntityCost} from "#shared/utils/units";

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

  const cost = computed(() => {
    return calculateForceCost(force)
  })


</script>

<template>

  <h1>Build your force: {{ force.name }}</h1>

  <h2>Point Cost {{cost}} / {{force.pointLimit}} pt</h2>

  <h2>Rooster</h2>

  <div class="grid grid-cols-2 gap-3">

    <div>
      <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        <UPageCard v-for="entry in force?.entries" variant="ghost" :to="`/builder/${forceId}/entries/${entry.id}`">
          <EntryPreviewItem :entry="entry"></EntryPreviewItem>
        </UPageCard>
      </ul>

      <UPageList divide>


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