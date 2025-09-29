<script setup lang="ts">
  import type {Entry, HardwareModule} from "~~/types/unit";
  import {useForcesStore} from "~/stores/forces";
  import MacEditor from "~/components/entry/MacEditor.vue";

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
</script>

<template>

  <UPageCard
      :title="entryDisplayName"
      icon="i-game-icons-missile-mech"
  >
    <EntryMacEditor v-if="entry.classification === 'MAC'" :entry="entry" />
    <EntryFormationEditor v-if="entry.classification === 'Formation'" :entry="entry" />

  </UPageCard>

  <UCard>
    <code>
      {{entry}}
    </code>
  </UCard>

  <UIcon name="i-game-icons-missile-mech" class="size-12" />
  <UIcon name="i-game-icons-tank" class="size-12" />
  <UIcon name="i-game-icons-dark-squad" class="size-12" />
  <UIcon name="i-game-icons-anti-aircraft-gun" class="size-12" />


</template>

<style scoped>

</style>