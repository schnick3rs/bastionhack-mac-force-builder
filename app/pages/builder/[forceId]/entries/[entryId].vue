<script setup lang="ts">
  import type {Entry, HardwareModule} from "~~/types/unit";
  import {useForcesStore} from "~/stores/forces";
  import MacEditor from "~/components/entry/MacEditor.vue";
  import {calculateEntityCost} from "#shared/utils/units";

  const route = useRoute();

  const forceId: string = route.params.forceId as string;
  const entryId: string = route.params.entryId as string;

  const forceStore = useForcesStore();

  const entry: Entry = forceStore.getEntry(forceId, entryId);

  const entryDisplayName = computed(() => {
    if (entry.classification === 'MAC') {
      return entry.name;
    }
    if (entry.classification === 'Formation') {
      return entry.unit.name;
    }
  })

  const cost = computed(() => {
    return calculateEntityCost(entry)
  })

</script>

<template>

  <UPageCard v-if="entry" :key="entry.id">

    <EntryMacEditor v-if="entry.classification === 'MAC'" :entry="entry" />
    <EntryFormationEditor v-if="entry.classification === 'Formation'" :entry="entry" />

  </UPageCard>

  <pre>
      {{entry}}
  </pre>

  <UIcon name="i-game-icons-missile-mech" class="size-12" />
  <UIcon name="i-game-icons-tank" class="size-12" />
  <UIcon name="i-game-icons-dark-squad" class="size-12" />
  <UIcon name="i-game-icons-anti-aircraft-gun" class="size-12" />


</template>

<style scoped>

</style>