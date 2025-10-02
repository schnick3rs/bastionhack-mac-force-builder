<script setup lang="ts">

import factions from "~~/server/data/factionRepository";

</script>

<template>
  <UPageGrid>
    <UPageCard
        v-for="faction in factions"
        :title="faction.name"
        :description="faction.sparks.join(', ')"
    >
      <template #header>
        <UAvatar :src="`/factions/${faction.key}-symbol.png`" size="md" />
      </template>
    </UPageCard>
  </UPageGrid>
</template>

<style scoped>

</style>