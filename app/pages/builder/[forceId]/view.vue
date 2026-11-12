<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import {usePlayStore} from "~/stores/play";
import type {Force, HardwareModule} from "~~/types/unit";
import {calculateForceCost, getUsedForceHardware} from "#shared/utils/units";
import {getHardwareCatalogue} from "#shared/utils/modules";
import factions from "~~/server/data/factionRepository";
import {factionName} from "#shared/utils/factions";
import {validateForce} from "#shared/utils/forces";
import type {Suit} from "#shared/utils/cards";
import {buildCards} from "#shared/utils/cards";

const forcesStore = useForcesStore();
const play = usePlayStore();
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

const suit = ref<Suit>('spades')
const cards = computed(() => buildCards(force, suit.value))
const mods = computed(() => force.mods ?? [])

const macEntries = computed(() => new Map(force.entries.map(e => [e.id, e])))
const remoteAssets = computed(() => force.entries.filter(e => e.classification === 'Remote asset'))

// division lives on the entry itself
function getDivision(id: string): number | undefined {
  return (macEntries.value.get(id) as { division?: number } | undefined)?.division
}
function setDivision(id: string, value: number | undefined) {
  const e = macEntries.value.get(id) as { division?: number } | undefined
  if (e) e.division = value
}

const usedHardwareStrings = computed((): string[] => getUsedForceHardware(force))

const usedHardware = computed((): HardwareModule[] => {
  return usedHardwareStrings.value
      .map(name => hardware.find(h => h.name === name))
      .filter(h => h !== undefined);
})

const validate = computed(() => validateForce(force))

// Where rules are shown: in the sidebar (default) or directly in the entry cards
type RulesMode = 'sidebar' | 'cards'
const rulesModeItems = [
  { label: 'Rules in sidebar', value: 'sidebar' },
  { label: 'Rules in cards', value: 'cards' },
]
const rulesMode = ref<RulesMode>('sidebar')
const rulesInCards = computed(() => rulesMode.value === 'cards')

onMounted(() => {
  const stored = localStorage.getItem('viewRulesMode')
  if (stored === 'sidebar' || stored === 'cards') rulesMode.value = stored
})
watch(rulesMode, (value) => localStorage.setItem('viewRulesMode', value))

function resetMarks() {
  if (window.confirm('Clear all damage, loss and used marks for this force?')) {
    play.reset(force!.id)
  }
}
</script>

<template>

  <!-- toolbar -->
  <div class="flex items-center mb-6  justify-between gap-2 flex-wrap">
    <UButton size="xl" variant="subtle" color="info" class="font-bold" icon="i-material-symbols-light-chevron-left-rounded" :to="`/builder/${force.id}/entries`">
      Back
    </UButton>

    <div class="flex-1 flex justify-center gap-2 flex-wrap">
      <USelect v-model="rulesMode" :items="rulesModeItems" value-key="value" size="xl" class="w-48" />
      <UFieldGroup size="xl">
        <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
        <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
        <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
        <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
      </UFieldGroup>
    </div>

    <div class="flex gap-2">
      <UButton size="xl" variant="outline" color="error" class="cursor-pointer" icon="i-material-symbols-light-restart-alt" @click="resetMarks">
        Reset
      </UButton>
      <UButton size="xl" variant="outline" color="info" class="font-bold" icon="i-game-icons-card-ace-spades" :to="`/builder/${force.id}/cards`">
        Cards
      </UButton>
      <UButton size="xl" variant="outline" color="info" class="font-bold" icon="i-material-symbols-light-print" :to="`/builder/${force.id}/print`">
        Print
      </UButton>
    </div>
  </div>

  <div class="page pb-12" v-if="force">

    <!-- title -->
    <div class="flex items-baseline justify-between gap-4 flex-wrap mb-6">
      <h1 class="text-3xl font-bold">{{ force.name }}</h1>
      <span class="text-sm text-muted">
        {{ calculateForceCost(force) }} pt ⸱ {{ force.entries.length }} entries
        <template v-if="force.faction"> ⸱ {{ factionName(force.faction) }} Faction</template>
      </span>
    </div>

    <div class="grid gap-8" :class="rulesInCards ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'">

      <!-- ENTRIES -->
      <div :class="rulesInCards ? '' : 'lg:col-span-3'">

        <template v-if="cards.macs.length">
          <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">MACs</h2>
          <div class="grid grid-cols-1 gap-4 mb-8" :class="rulesInCards ? 'lg:grid-cols-2' : ''">
            <PlayMacCard
                v-for="card in cards.macs"
                :key="card.id"
                :card="card"
                :entry="macEntries.get(card.id) as any"
                :force-id="force.id"
                :show-rules="rulesInCards"
                :mods="mods"
                :division="getDivision(card.id)"
                @update:division="setDivision(card.id, $event)"
            />
          </div>
        </template>

        <template v-if="cards.formations.length">
          <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">Auxiliary formations</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-8" :class="rulesInCards ? 'xl:grid-cols-3' : ''">
            <PlayFormationCard
                v-for="card in cards.formations"
                :key="card.id"
                :card="card"
                :force-id="force.id"
                :show-rules="rulesInCards"
                :division="getDivision(card.id)"
                @update:division="setDivision(card.id, $event)"
            />
          </div>
        </template>

        <template v-if="remoteAssets.length">
          <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">Remote assets</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div v-for="asset in remoteAssets" :key="asset.id" class="rounded-xl border border-default bg-elevated/40 p-4 ">
              <div class="font-bold">{{ asset.name }}<span v-if="'cost' in asset && asset.cost" class="text-muted font-normal"> ⸱ {{ asset.cost }} pts</span></div>
              <p v-if="'effect' in asset" class="text-sm text-muted">{{ asset.effect }}</p>
            </div>
          </div>
        </template>

      </div>

      <!-- RULES / REMINDERS (sidebar, or below the cards when rules are in the cards) -->
      <div :class="rulesInCards ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start' : 'lg:col-span-2'">

        <!-- Faction Rules -->
        <div v-if="faction && !rulesInCards" class="mb-4">
          <div class="pb-1">
            <span class="font-bold text-xl underline underline-offset-1">Faction Special Rule</span>
            <span class="pl-2 font-normal text-sm">(see pg. 24 ff)</span>
          </div>
          <p class="pb-2">
            <span class="font-bold">{{ faction.specialRule.name }}:</span>
            {{ faction.specialRule.description }}
          </p>
        </div>

        <!-- Command Drills -->
        <div v-if="mods.includes('Command Drills')" class="mb-4">
          <div class="pb-1">
            <span class="font-bold text-xl underline underline-offset-1">Command Drill</span>
            <span class="pl-2 font-normal text-sm">(see pg. 57)</span>
          </div>
          <UAlert
              v-if="force.commandDrill"
              color="neutral"
              variant="subtle"
              icon="i-game-icons-star-medal"
              :title="force.commandDrill.name"
              :description="force.commandDrill.effect"
              :ui="{ root: 'p-2' }"
          />
        </div>

        <!-- Hardware Rules -->
        <div v-if="!rulesInCards && usedHardware.length > 0" class="mb-4">
          <div class="pb-1">
            <span class="font-bold text-xl underline underline-offset-1">Hardware Rules</span>
            <span class="pl-2 font-normal text-sm">(see pg. 16-17)</span>
          </div>
          <p v-for="item in usedHardware" :key="item.name" class="pb-2">
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
        <div class="mb-4">
          <div class="pb-1">
            <span class="font-bold text-xl underline underline-offset-1">Deployment Cheat Sheet</span>
            <span class="pl-2 font-normal text-sm">(see pg. 20)</span>
          </div>
          <ol class="list-decimal ml-4">
            <li>Split force into 3 divisions</li>
            <li>No division can contain more than <strong>{{ Math.floor(force.entries.length / 2) }}</strong> units (MAC or Formations).</li>
            <li>Each division must contain 1 MAC</li>
            <li>A MAC within Division A must be specified as your commander</li>
          </ol>
        </div>

        <!-- Validation -->
        <div class="mb-4">
          <div class="pb-1">
            <span class="font-bold text-xl underline underline-offset-1">Validation</span>
          </div>
          <ul>
            <li v-for="v in validate" :key="v.message" class="mb-2">
              <UAlert v-if="v.valid" icon="i-material-symbols-light-check-circle-outline" color="success" variant="soft" :title="v.message" :ui="{ root: 'p-2'}"></UAlert>
              <UAlert v-else icon="i-material-symbols-light-error-outline" color="error" variant="soft" :title="v.message" :ui="{ root: 'p-2'}"></UAlert>
            </li>
          </ul>
        </div>

      </div>

    </div>

  </div>

</template>
