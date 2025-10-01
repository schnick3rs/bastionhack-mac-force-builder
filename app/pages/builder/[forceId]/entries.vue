<script setup lang="ts">
  import {useForcesStore} from "~/stores/forces";
  import type {Force} from "~~/types/unit";

  const forcesStore = useForcesStore();
  const route = useRoute();
  const forceId: string = route.params.forceId as string;
  const force: Force | undefined = forcesStore.forceById(forceId)
  if (!force) {
    throw new Error('Force not found')
  }

  const { data: faction, status } = await useFetch(`/api/factions/${force.faction}`, { lazy: true });

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

  <div>
    <UUser
        :avatar="{ src: `/factions/${force.faction}-symbol.png` }"
        :name="force.name"
        :description="`${faction?.name}`"
    >
    </UUser>
    <h1 class="text-3xl font-bold">{{ force.name }}</h1>
  </div>

  <em>{{ force.description }}</em>

  <div class="font-xl">
    <span class="text-sm">[{{force.entries.length}} entries]</span>
    Point {{cost}} / {{force.pointLimit}} pt
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" >

    <div>

      <UPageList>
        <UPageCard
            class="cursor-pointer mb-2"
            :highlight="entry.id === selected"
            v-for="entry in force?.entries"
            variant="subtle"
            :to="`/builder/${forceId}/entries/${entry.id}`"
            @click="selected = entry.id"
        >
          <EntryPreviewItem :entry="entry"></EntryPreviewItem>
        </UPageCard>
      </UPageList>

      <UPageList divide>


      </UPageList>

      <UFieldGroup>
        <UButton variant="outline" @click="addMac">Add MAC</UButton>
        <UButton variant="outline" @click="addVehicleFormation">Add Vehicle Formation</UButton>
        <UButton variant="outline" @click="addInfantryFormation">Add Infantry Formation</UButton>
      </UFieldGroup>

      <pre class="hidden">
        {{ force }}
      </pre>
    </div>

    <div :key="selected">
      <NuxtPage/>
    </div>

  </div>



</template>

<style scoped>

</style>