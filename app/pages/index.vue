<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";

const forcesStore = useForcesStore();
const forces = forcesStore.allForces;

</script>

<template>

  <UPageGrid>

    <UPageCard
        title="MAC Attack"
        description='"Mobile Armour Colossus. A fast-playing, explosive mecha tabletop wargame, where factions of a fractured humanity fight for dominance on alien new worlds."'
        to="https://www.backerkit.com/c/projects/bastionland-press/mac-attack-sci-fi-mecha-miniature-wargame"
        target="_blank"
    >
      <template #footer>
        Check it out on Backerkit!
      </template>
    </UPageCard>

    <UCard>

      Create a new force

      <template #footer>
        <UButton to="/builder/createForce">
          Build a new Force
        </UButton>
      </template>
    </UCard>

    <UPageCard title="My created Forces">

      <UPageList divide>
        <template ></template>
        <UPageCard
            v-for="force in forces"
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