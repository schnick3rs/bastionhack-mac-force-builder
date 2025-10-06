<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Entry, Force, HardwareModule} from "~~/types/unit";
import {displayClassificaition, getUsedForceHardware} from "#shared/utils/units";
import {convertToNiceware, getHardwareCatalogue} from "#shared/utils/modules";
import factions from "~~/server/data/factionRepository";
import {buildWeaponDisplayString} from "#shared/utils/weapons";

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

function groupBy<T extends Record<string, any>, K extends keyof T>(
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

const usedHardware = computed((): HardwareModule[] => {
  const modules = usedHardwareStrings.value.map(name => hardware.find(h => h.name === name)).filter(h => h !== undefined);
  return modules;
})

const totalUnitCount = computed(() => {
  return force.entries.reduce((acc, entry) => {
    if (entry.classification === 'MAC') {
      return acc + 1
    }
    if (entry.classification === 'Formation') {
      return acc + entry.size
    }
    return acc
  }, 0)
})

</script>

<template>


  <div class="flex justify-center mb-4">
    <UFieldGroup size="xl">
      <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
      <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
      <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
      <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
    </UFieldGroup>
  </div>

  <div class="flex flex-col justify-center align-center" v-if="force">

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4" >

      <!-- ENTRIES -->
      <UPageList class="col-span-2" data="page-list">

        <UPageCard
            v-for="(entry, index) in force.entries"
            orientation="vertical"
            class="mb-3"
            :ui="{ container: 'sm:p-2' }"
        >
          <div class="flex flex-row gap-2">

            <!-- SUIT CARD -->
            <div class="flex flex-col justify-top items-center w-16">
              <UIcon :name="`i-game-icons-card-${ indexToCard[index] }-${ suit }`" class="size-16 shrink-0" :class="{ 'bg-error': ['hearts', 'diamonds'].includes(suit) }"/>
              <UIcon name="i-game-icons-square" class="size-12 text-gray-300" />
              <span class="text-sm italic text-gray-400">Division</span>
            </div>

            <!-- ENTRY CARD -->
            <div class="flex-1 w-full">

              <h2 class="font-bold text-xl">
                {{ entry.name || `${entry.size}x ${entry.unit.name}` }}
                ⸱ [{{ calculateEntityCost(entry)}}pts]
              </h2>

              <div class="mb-2">
                {{ displayClassificaition(entry) }}
                <span v-if="entry.classification === 'MAC'" class="flex-row">
                    <UIcon v-for="i in (entry.class + (force.faction === 'arksworn-order' ? 1 : 0))" name="i-material-symbols-light-check-box-outline-blank" class=""></UIcon>
                  </span>
              </div>

              <template v-if="entry.classification === 'MAC'">

                <div class="grid grid-cols-2 gap-2">

                  <ul>
                    <li v-for="module in entry.modules" class="w-full flex flex-row justify-between items-center">
                      {{module.slot}} -
                      <template v-if="module.type === 'Weapon'">
                        {{buildWeaponDisplayString(module.profile)}}
                      </template>
                      <template v-if="module.type === 'Hardware'">
                        {{module.profile.name}}
                      </template>
                      <div>
                        <UIcon v-for="i in 2" name="i-material-symbols-light-check-box-outline-blank"></UIcon>
                      </div>
                    </li>
                  </ul>

                  <div>
                    <div class="flex flex-row gap-1">
                      <h4 class="font-bold ">Notes</h4>
                      <div class="w-full border-b-1 ml-2" style="height: 1px; border-color: rgba(0,0,0, 0.1); top: 12px; position: relative;"></div>
                    </div>
                    <UTextarea class="w-full" :rows="5" placeholder="Perks, Flaws, Pilot Skills, ...."></UTextarea>
                  </div>

                </div>


              </template>


              <template v-if="entry.classification === 'Formation'">

                <ul class="flex flex-wrap gap-2">
                  <template v-for="(weapon, index) in entry.unit.weapons">
                    <li>{{ buildWeaponDisplayString(weapon) }}</li>
                    <span v-if="index < (entry.unit.weapons.length + convertToNiceware(entry.unit.hardware).length) -1"> ⸱ </span>
                  </template>

                  <template v-for="(hardware, index) in convertToNiceware(entry.unit.hardware)">
                    <li>
                      <span v-if="hardware.count > 1">2x </span>
                      <span style="text-decoration: underline dashed; text-underline-offset: 4px">{{ hardware.name }}</span>
                    </li>
                    <span v-if="index < convertToNiceware(entry.unit.hardware).length -1"> ⸱ </span>
                  </template>
                </ul>

              </template>

            </div>

          </div>

        </UPageCard>

      </UPageList>

      <!-- RULES -->
      <div>

        <h1 class="font-bold text-2xl">{{ force.name }}</h1>

        <div>
          {{calculateForceCost(force)}}pt ⸱ {{force.entries.length}} entries
        </div>

        <div v-if="faction">
          <h2 class="font-bold text-xl ">A <em>{{ faction.name }}</em> Force</h2>

          <div class="mt-4">
            <h4 class="font-bold text-xl pb-2 underline underline-offset-4 under">Faction Special Rule</h4>
            <p class="pb-2">
              <span class="font-bold">{{ faction.specialRule.name }}:</span>
              {{ faction.specialRule.description }}
            </p>
          </div>
        </div>

        <div class="mt-4">
          <h4 class="font-bold text-xl pb-2 underline underline-offset-4 under">Hardware Rules</h4>
          <p v-for="item in usedHardware" class="pb-2">
            <span class="font-bold">
              {{ item.name }}
              <template v-if="faction && item.origin === 'faction'">
                <UAvatar :src="`/factions/${force.faction}-symbol.png`" class="size-4 mb-1"/>
              </template>:
            </span>
            {{ item.effect }}
          </p>

        </div>

        <!-- Reminders -->
        <div class="mt-4">
          <h4 class="font-bold text-xl pb-2 underline underline-offset-4 under">Deployment Cheat Sheet</h4>
          <h4>Run the game (see pg. 20)</h4>
          <ol class="list-decimal list-inside">
            <li>Split force into 3 divisions</li>
            <li>No division can contain more than <strong>{{Math.floor(force.entries.length / 2)}}</strong> units (MAC or Formations).</li>
            <li>Each division must contain 1 MAC</li>
            <li>A MAC within Division A must be specified as your <strong>commander</strong></li>
          </ol>
        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>
</style>