<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import {factionName} from "#shared/utils/factions";

const forcesStore = useForcesStore();
const forces = forcesStore.allForces;

const sortedForces = computed(() => forces.toSorted((a, b) => b.updatedAt - a.updatedAt))

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

      <div><em>Lists are stored in your browsers local storage</em></div>

      <template #footer>
        <UButton to="/builder/createForce" class="w-full" size="xl" color="info">
          Build a new Force
        </UButton>
      </template>
    </UCard>

    <UPageCard :ui="{ title: 'flex-row items-center justify-between' }">

      <template #title>
        <UIcon name="i-game-icons-checklist" class="mr-2" size="20" />
        <span>Saved forces</span>
        <UButton to="/forces" variant="ghost" class="flex-2 font-bold" color="info">View All</UButton>
      </template>

      <UPageList divide>
        <UPageCard
            variant="ghost"
            v-for="force in sortedForces.slice(0, 3)"
            :to="`/builder/${force.id}/entries`"
        >

          <UUser
              :description="`${force.pointLimit}pts ⸱ ${force.entries.length} entries`"
              :avatar="{ src: `/factions/${force.faction}-symbol.png` }"
          >
            <template #name>{{force.name}}</template>
            <template #description>
              {{force.pointLimit}}pts ⸱ {{force.entries.length}} entries
              <span v-if="force.faction"> ⸱ {{factionName(force.faction)}}</span>
            </template>
          </UUser>

          <div v-if="force.createdAt" class="text-xs">
            Modified {{ new Date(force.updatedAt).toLocaleString("en-GB", {  year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) }}
          </div>

        </UPageCard>

      </UPageList>
    </UPageCard>

    <UPageCard
        title="Learn the Factions"
        description='Check or the various factions that are available in the game.'
        to="/factions"
    >
      <template #footer>

      </template>
    </UPageCard>



  </UPageGrid>

</template>

<style scoped>

</style>