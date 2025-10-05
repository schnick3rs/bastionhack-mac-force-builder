<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Force} from "~~/types/unit";
import {displayClassificaition, getUsedForceHardware} from "#shared/utils/units";
import {getHardwareCatalogue} from "#shared/utils/modules";
import factions from "~~/server/data/factionRepository";

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string;
const force: Force | undefined = forcesStore.forceById(forceId)
if (!force) {
  throw new Error('Force not found')
}

const hardware = getHardwareCatalogue(force.faction)
const faction = factions.find((f) => f.key === force.faction)

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

const classified = computed(() => {
  return groupBy(force.entries, 'classification')
})

const usedHardwareStrings = computed((): string[] => {
  return getUsedForceHardware(force)
})

const usedHardware = computed(() => {
  console.info('usedHardware', usedHardwareStrings.value)
  const modules = usedHardwareStrings.value.map(name =>hardware.find(h => h.name === name))
  console.info('modules', modules)
  return modules;
})

</script>

<template>

  <div class="flex flex-col justify-center align-center" v-if="force">

    <h1>{{ force.name }}</h1>

    <div class="flex justify-center mb-4">
      <UFieldGroup size="xl">
        <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
        <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
        <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
        <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
      </UFieldGroup>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4" >

      <div>
        <UPageList>

          <template v-for="(entries, clazz, index) in classified">
            <div class="flex flex-row gap-1 my-2">
              <div class="w-full border-b-1 mr-2" style="height: 1px; border-color: rgba(0,0,0, 0.2); top: 12px; position: relative;"></div>
              <h4 class="font-bold ">{{ clazz }}s</h4>
              <div class="w-full border-b-1 ml-2" style="height: 1px; border-color: rgba(0,0,0, 0.2); top: 12px; position: relative;"></div>
            </div>

            <UPageCard
                v-for="(entry, index) in entries"
                orientation="horizontal"
                class="mb-3"
                :ui="{ container: 'sm:p-2' }"
            >
              <div class="flex flex-row gap-2">

                <UIcon :name="`i-game-icons-card-${ indexToCard[index] }-${ suit }`" class="size-16 shrink-0" :class="{ 'bg-error': ['hearts', 'diamonds'].includes(suit) }"/>

                <div class="flex-1">
                  <h2>{{ entry.name || `${entry.size}x ${entry.unit.name}` }}</h2>
                  <h3>
                    {{ displayClassificaition(entry) }}
                    <span v-if="entry.classification === 'MAC'">
                      <UIcon name="i-material-symbols-light-check-box-outline-blank" class="size-8" />
                    </span>
                  </h3>
                </div>

              </div>

            </UPageCard>

          </template>

        </UPageList>

      </div>

      <div>
        <h1 class="font-bold text-3xl">{{ force.name }}</h1>

        <div v-if="faction">
          <h2 class="font-bold text-2xl">A <em>{{ faction.name}}</em> Force</h2>

          <div class="mt-4">
            <h4 class="font-bold text-xl pb-2 underline underline-offset-4 under">Faction Special Rule</h4>
            <p class="pb-2">
              <span class="font-bold">{{ faction.specialRule.name}}:</span>
              {{ faction.specialRule.description }}
            </p>
          </div>
        </div>

        <div class="mt-4">
          <h4 class="font-bold text-xl pb-2 underline underline-offset-4 under">Hardware Rules</h4>
          <p v-for="item in usedHardware" class="pb-2">
            <span class="font-bold">
              {{ item.name}}
              <template v-if="faction && item?.origin === 'faction'">
                <UAvatar :src="`/factions/${force.faction}-symbol.png`" class="size-4 mb-1" />
              </template>:
            </span>
            {{ item.effect }}
          </p>

        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>
</style>