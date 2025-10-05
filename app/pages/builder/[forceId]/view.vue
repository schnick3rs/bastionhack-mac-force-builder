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

const suit = ref('spades')

//'spades', 'hearts', 'diamonds', 'clubs'
const suitOptions = ['spades', 'hearts', 'diamonds', 'clubs']

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

function groupBy<T extends Record<string, Entry>, K extends keyof T>(
    array: T[],
    key: K
): Record<string, T[]> {
  return array.reduce((acc, obj) => {
    const groupKey = String(obj[key])
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(obj)
    return acc
  }, {} as Record<string, T[]>)
}

const groupedByClassification = computed(() => {
  return groupBy(force.entries, 'classification')
})

</script>

<template>

  <div class="flex flex-col justify-center align-center w-fit" v-if="force">
    <h1>{{ force.name }}</h1>

    <div class="flex justify-center mb-4">
      <UFieldGroup size="xl">
        <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
        <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
        <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
        <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
      </UFieldGroup>
    </div>

    <UPageList>

      <h2>MACs</h2>
      <hr class="mb-2">

      <UPageCard
        v-for="(entry, index) in force.entries"
        orientation="horizontal"
        class="mb-3"
        :ui="{ container: 'sm:p-2' }"
      >
        <UIcon :name="`i-game-icons-card-${ indexToCard[index] }-${ suit }`" class="size-16" :class="{ 'bg-error': ['hearts', 'diamonds'].includes(suit) }"/>
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