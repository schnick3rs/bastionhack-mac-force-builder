<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";

const forcesStore = useForcesStore();
const forces = forcesStore.allForces;

</script>

<template>

  <UPageGrid>

    <UCard>

      Create a new force

      <template #footer>
        <UButton to="/builder/createForce">
          Create
        </UButton>
      </template>
    </UCard>

    <UPageCard title="My Forces">

      <UPageList divide>
        <UPageCard
            v-for="force in forces"
            variant="ghost"
            :to="`/builder/${force.id}/entries`"
        >
          <UUser :name="force.name"></UUser>
        </UPageCard>
      </UPageList>
    </UPageCard>



  </UPageGrid>

</template>

<style scoped>

</style>