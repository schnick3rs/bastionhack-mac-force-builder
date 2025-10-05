<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Force} from "~~/types/unit";
import {displayClassificaition} from "#shared/utils/units";

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string;
const force: Force | undefined = forcesStore.forceById(forceId)
if (!force) {
  throw new Error('Force not found')
}

// `i-game-icons--card-{value}-{blatt}

const blatt = ref('spades')

const indexToCard = [
  'ace',
  'king',
  'queen',
  'jack',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
]

</script>

<template>

  <div class="flex flex-col justify-center align-center w-fit" v-if="force">
    <h1>{{ force.name }}</h1>

    <UPageList>

      <UPageCard
        v-for="(entry, index) in force.entries"
        orientation="horizontal"
      >
        <UIcon :name="`i-game-icons-card-${ indexToCard[index] }-${ blatt }`" class="size-16" />
        <div>
          <h2>{{ entry.name || `${entry.size}x ${entry.unit.name}` }}</h2>
          <h3>{{ displayClassificaition(entry) }}</h3>
        </div>
      </UPageCard>

    </UPageList>

  </div>

</template>

<style scoped>

</style>