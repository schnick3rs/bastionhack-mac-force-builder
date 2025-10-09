<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Entry, Force, HardwareModule} from "~~/types/unit";
import {displayClassificaition, getUsedForceHardware} from "#shared/utils/units";
import {convertToNiceware, getHardwareCatalogue} from "#shared/utils/modules";
import factions from "~~/server/data/factionRepository";
import {buildWeaponDisplayString} from "#shared/utils/weapons";
import {factionName} from "#shared/utils/factions";
import {validateForce} from "#shared/utils/forces";

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string;
const force: Force | undefined = forcesStore.forceById(forceId)
if (!force) {
  throw new Error('Force not found')
}

const hardware = getHardwareCatalogue(force.faction)
const faction = factions.find((f) => f.key === force.faction)

useHead({
  title: `${force.name} | MACtory`,
})

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

const suitSwap = {
  'spades': 'clubs',
  'hearts': 'diamonds',
  'diamonds': 'hearts',
  'clubs': 'spades',
}

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

const validate = computed(() => {
  return validateForce(force)
})

function handlePrint() {
  window.print()
}

const danger = [
    'success',
    'warning',
    'error',
    'neutral',
]

</script>

<template>

  <div class="flex items-center mb-4 print:hidden justify-between">
    <!-- Left -->
    <div>
      <UButton size="xl" variant="subtle" color="info" class="font-bold" icon="i-material-symbols-light-chevron-left-rounded" :to="`/builder/${force.id}/entries`">
        Back
      </UButton>
    </div>

    <!-- Center -->
    <div class="flex-1 flex justify-center">
      <UFieldGroup size="xl">
        <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
        <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
        <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
        <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
      </UFieldGroup>
    </div>

    <div>
      <UButton size="xl" variant="outline" color="info" class="font-bold cursor-pointer" icon="i-material-symbols-light-print" @click="handlePrint">
        Print
      </UButton>
    </div>

  </div>

  <div class="flex flex-col justify-center align-center page" v-if="force">

    <div class="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4 print:grid-cols-5 print:gap-4 print-layout">

      <!-- ENTRIES -->
      <UPageList class="col-span-3" data="page-list">

        <UPageCard
            v-for="(entry, index) in force.entries"
            orientation="vertical"
            class="mb-3 print:break-inside-avoid"
            :ui="{ container: 'sm:p-2' }"
        >
          <div class="flex flex-row gap-2">

            <!-- SUIT CARD -->
            <div class="flex flex-col justify-top items-center w-16">
              <UIcon
                  v-if="index < 13"
                  :name="`i-game-icons-card-${ indexToCard[index] }-${ suit }`"
                  class="size-16 shrink-0"
                  :class="{ 'bg-error': ['hearts', 'diamonds'].includes(suit) }"
              />
              <UIcon
                  v-if="index > 12"
                  :name="`i-game-icons-card-${ indexToCard[index-13] }-${ suitSwap[suit] }`"
                  class="size-16 shrink-0"
                  :class="{ 'bg-error': ['hearts', 'diamonds'].includes(suit) }"
              />
              <UIcon name="i-game-icons-square" class="size-12 text-gray-300" />
              <span class="text-sm italic text-gray-400">Division</span>
            </div>

            <!-- ENTRY CARD -->
            <div class="flex-1 w-full">

              <h2 class="font-bold text-xl">
                {{ entry.name || `${entry.size}x ${entry.unit.name}` }}
                ⸱ [{{ calculateEntityCost(entry)}}pts]
              </h2>

              <div class="mb-2 flex flex-row gap-1">
                {{ displayClassificaition(entry) }}
                <template v-if="entry.classification === 'MAC'">
                  ⸱
                  <UCheckbox
                        v-for="i in (entry.class + (force.faction === 'arksworn-order' ? 1 : 0))"
                        :color="danger[3 - (entry.class + (force.faction === 'arksworn-order' ? 1 : 0)) + i]"
                        class="flex "
                        style="border: 1px solid"
                    ></UCheckbox>
                </template>
              </div>

              <!-- MAC Entry -->
              <template v-if="entry.classification === 'MAC'">

                <div class="grid grid-cols-2 gap-2">

                  <ul>
                    <li v-for="module in entry.modules" class="w-full flex flex-row justify-between items-center odd:bg-gray-100 dark:odd:bg-gray-800" >
                      <div>
                        {{module.slot}} -
                        <template v-if="module.type === 'Weapon'">
                          <template v-if="module.double">2x </template>
                          {{buildWeaponDisplayString(module.profile)}}
                        </template>
                        <template v-if="module.type === 'Hardware'">
                          <span v-if="module.double">2x </span>
                          {{module.profile.name}}
                        </template>
                      </div>
                      <div class="flex flex-row gap-1">
                        <UCheckbox color="warning" class="flex" style="border: 1px solid"></UCheckbox>
                        <UCheckbox color="error" class="flex" style="border: 1px solid"></UCheckbox>
                      </div>
                    </li>
                  </ul>

                  <div>
                    <template v-if="force.mods && force.mods.includes('Pilot Tricks')" >
                      <div v-if="entry.pilot" class="pb-1">
                        <p class="text-sm page-text-sm">
                          <UIcon name="i-game-icons-samus-helmet" size="12" class="mr-1"></UIcon>
                          <span class="font-bold">{{ entry.pilot.name }}:</span>
                          <span v-if="entry.pilot.rookie">&nbsp;Rookie Pilot</span>
                          <span v-else-if="entry.pilot.trick">&nbsp;{{ entry.pilot.trick.effect }}</span>
                        </p>
                      </div>
                    </template>
                    <template v-if="force.mods && force.mods.includes('Perks & Flaws')">
                      <div v-for="feat in entry.perks" class="pb-1">
                        <p class="text-sm page-text-sm">
                          <UIcon name="i-game-icons-power-lightning" size="12" class="mr-1"></UIcon>
                          <span class="font-bold">{{ feat.name }}:</span> {{ feat.effect }}
                        </p>
                      </div>
                      <div v-for="feat in entry.flaws" class="pb-1">
                        <p class="text-sm page-text-sm">
                          <UIcon name="i-game-icons-power-lightning" size="12" class="mr-1"></UIcon>
                          <span class="font-bold">{{ feat.name }}:</span> {{ feat.effect }}
                        </p>
                      </div>
                    </template>
                    <UTextarea class="w-full" :rows="3" placeholder="Perks, Flaws, Pilot Skills, Notes, ...."></UTextarea>
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

              <template v-if="entry.classification === 'Remote asset'">
                <p>{{entry.effect}}</p>
              </template>

            </div>

          </div>

        </UPageCard>

      </UPageList>

      <!-- RULES -->
      <div class="col-span-2">

        <h1 class="font-bold text-2xl page-headline" >{{ force.name }}</h1>

        <div>
          {{calculateForceCost(force)}}pt ⸱ {{force.entries.length}} entries
          <span v-if="force.faction"> ⸱ {{factionName(force.faction)}} Faction</span>
        </div>

        <div v-if="faction">
          <div class="mt-4">
            <h4 class="font-bold text-xl pb-1 under">Faction Special Rule</h4>
            <p class="pb-2">
              <span class="font-bold">{{ faction.specialRule.name }}:</span>
              {{ faction.specialRule.description }}
            </p>
          </div>
        </div>

        <div class="mt-4" v-if="usedHardware && usedHardware.length > 0">
          <h4 class="font-bold text-xl pb-1 under">Hardware Rules</h4>
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
          <h4 class="font-bold text-xl under">Deployment Cheat Sheet</h4>
          <p class="italic pb-2">see pg. 20</p>
          <ol class="list-decimal ml-4">
            <li>Split force into 3 divisions</li>
            <li>No division can contain more than <strong>{{Math.floor(force.entries.length / 2)}}</strong> units (MAC or Formations).</li>
            <li>Each division must contain 1 MAC</li>
            <li>A MAC within Division A must be specified as your commander</li>
          </ol>
        </div>

        <!-- Validation -->
        <div class="mt-4" :class="{ 'print:hidden': validate.filter(v => v.valid).length > 0 }">
          <h4 class="font-bold text-xl pb-1 under">Validation</h4>
          <ul>
            <li v-for="v in validate" class="mb-2">
              <UAlert v-if="v.valid" icon="i-material-symbols-light-check-circle-outline" color="success" variant="soft" :title="v.message" class=" print:hidden" :ui="{ root: 'p-2'}"></UAlert>
              <UAlert v-else icon="i-material-symbols-light-error-outline" color="error" variant="soft" :title="v.message" :ui="{ root: 'p-2'}"></UAlert>
            </li>
          </ul>
        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>

@media print {

  body {
    zoom: 1.0;
  }

  @page {
    size: A4 portrait;
    margin-top: 5mm; /* or whatever you want */
    margin-left: 5mm;
    margin-right: 5mm;
    margin-bottom: 10mm;

    @bottom-center {
      font-size: 3.2mm;
      content: counter(page) " / " counter(pages);
    }
    @bottom-right {
      font-size: 3.2mm;
      content: "Created with MACtory at mactory.ravenbeak.dev";
    }

  }

  .page {
    font-size: 3.6mm;
    line-height: 1.2;
  }

  .page-text-sm {
    font-size: 3.2mm;
    line-height: 1.1;
  }

  .page-headline {
    font-family: serif !important;
    background-color: black;
    color: white;
    border-radius: 2mm 0 0 2mm;
    padding-left: 3mm;
    font-size: 4.5mm;
  }

  .page-xl {
    font-size: 4.2mm;
  }

  .card {
    margin-top: 1rem; /* extra spacing from top */
  }
}

</style>