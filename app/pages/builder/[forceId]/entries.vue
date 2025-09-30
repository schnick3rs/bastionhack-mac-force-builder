<script setup lang="ts">
  import {useForcesStore} from "~/stores/forces";
  import type {Entry, Force, HardwareModule} from "~~/types/unit";
  import {calculateEntityCost} from "#shared/utils/units";

  const forcesStore = useForcesStore();
  const route = useRoute();
  const forceId: string = route.params.forceId as string;
  const force: Force | undefined = forcesStore.forceById(forceId)
  if (!force) {
    throw new Error('Force not found')
  }

  function addMac() {
    forcesStore.addNewEntry(forceId, 'MAC');
  }
  function addVehicleFormation() {
    forcesStore.addNewEntry(forceId, 'Vehicle');
  }
  function addInfantryFormation() {
    forcesStore.addNewEntry(forceId, 'Infantry');
  }

  const selected = ref('')

  const cost = computed(() => {
    return calculateForceCost(force)
  })


</script>

<template>

  <h1 class="text-3xl font-bold">{{ force.name }}</h1>
  <em>{{ force.description }}</em>

  <div class="font-xl">
    <span class="text-sm">[{{force.entries.length}} entries]</span>
    Point {{cost}} / {{force.pointLimit}} pt
  </div>

  <div class="grid grid-cols-2 gap-3 pt-4">

    <div>
      <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        <UPageCard
            v-for="entry in force?.entries"
            variant="ghost"
            :to="`/builder/${forceId}/entries/${entry.id}`"
            @click="selected = entry.id"

        >
          <EntryPreviewItem :entry="entry"></EntryPreviewItem>
        </UPageCard>
      </ul>

      <UPageList divide>


      </UPageList>

      <UFieldGroup>
        <UButton variant="outline" @click="addMac">Add MAC</UButton>
        <UButton variant="outline" @click="addVehicleFormation">Add Vehicle Formation</UButton>
        <UButton variant="outline" @click="addInfantryFormation">Add Infantry Formation</UButton>
      </UFieldGroup>

      <pre class="hidden">
        {{ force.entries }}
      </pre>
    </div>

    <div :key="selected">
      <NuxtPage/>
    </div>

  </div>



</template>

<style scoped>

</style>