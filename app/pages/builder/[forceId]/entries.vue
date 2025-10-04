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

  const { data: faction } = await useFetch(`/api/factions/${force.faction}`, { lazy: true });

  function addMac() {
    forcesStore.addNewEntry(forceId, 'MAC');
  }
  function addVehicleFormation() {
    forcesStore.addNewEntry(forceId, 'Vehicle');
  }
  function addInfantryFormation() {
    forcesStore.addNewEntry(forceId, 'Infantry');
  }
  function addRemoteAsset() {
    forcesStore.addNewEntry(forceId, 'RemoteAsset');
  }

  function removeEntry(entryId: string) {
    if (selected.value === entryId) {
      selected.value = '';
      // TODO push to parent
      navigateTo( {path: `/builder/${forceId}/entries`})
    }
    forcesStore.removeEntry(forceId, entryId);
  }

  const selected = ref('')

  function selectEntry(entryId: string) {
    selected.value = entryId
    navigateTo( {path: `/builder/${forceId}/entries/${entryId}`})
  }

  const cost = computed(() => calculateForceCost(force));

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


  <UFieldGroup class="py-4">
    <UButton color="info" variant="outline" @click="addMac">Add MAC</UButton>
    <UButton color="info" variant="outline" @click="addVehicleFormation">Add Vehicle Formation</UButton>
    <UButton color="info" variant="outline" @click="addInfantryFormation">Add Infantry Formation</UButton>
    <UTooltip text="Enable Remote Assets Variant Rule">
      <UButton color="neutral" variant="subtle" disabled @click="addRemoteAsset">Add Remote Asset</UButton>
    </UTooltip>
  </UFieldGroup>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" >

    <div>

      <UPageList>
        <UPageCard
            class="mb-3"
            :ui="{ container: 'sm:p-4' }"
            highlight-color="info"
            :highlight="entry.id === selected"
            v-for="entry in force?.entries"
            variant="subtle"
            orientation="vertical"
            @click="selectEntry(entry.id)"
        >
          <EntryPreviewItem :entry="entry" @removeEntry="removeEntry($event)"></EntryPreviewItem>
        </UPageCard>
      </UPageList>

      <pre class="hidden">
        {{ force }}
      </pre>
    </div>

    <div :key="selected">
      <NuxtPage/>
    </div>

  </div>

</template>
