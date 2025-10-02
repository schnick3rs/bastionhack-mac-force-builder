<script setup lang="ts">
  import type {Entry} from "~~/types/unit";
  import {useForcesStore} from "~/stores/forces";

  const route = useRoute();

  const forceId: string = route.params.forceId as string;
  const entryId: string = route.params.entryId as string;

  const forceStore = useForcesStore();

  const force = forceStore.forceById(forceId);
  const entry: Entry = forceStore.getEntry(forceId, entryId);

</script>

<template>

  <UPageCard v-if="entry" :key="entry.id">

    <EntryMacEditor v-if="entry.classification === 'MAC'" :entry="entry" :factionKey="force?.faction" />
    <EntryFormationEditor v-if="entry.classification === 'Formation'" :entry="entry"  :factionKey="force?.faction" />

  </UPageCard>

</template>

<style scoped>

</style>