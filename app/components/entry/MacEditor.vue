<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";

const { entry, factionKey } = defineProps<{ entry: MAC, factionKey: string | undefined }>()

import type {Feat, FeatType, MAC, ModuleConfig} from "~~/types/unit";
import {calculateMacCost} from "#shared/utils/units";

const cost = computed(() => calculateMacCost(entry))

function setSlotModule(slot: number, module: ModuleConfig) {
  console.info('setSlotModule', slot, module, entry.modules)
  const index = entry.modules.findIndex(item => item.slot === slot);
  entry.modules[index] = module;
}

function sortGroup(m: ModuleConfig) {
  if (m.type === 'Weapon') return m.profile.range === 'Brawl' ? 1 : 0
  if (m.type === 'Hardware') return 2
  return 3
}

function sortModules() {
  const sorted = [...entry.modules].sort((a, b) => {
    const g = sortGroup(a) - sortGroup(b)
    if (g !== 0) return g
    if (a.type === 'Weapon' && b.type === 'Weapon' && a.profile.range !== 'Brawl') {
      const p = b.profile.power - a.profile.power
      if (p !== 0) return p
    }
    const an = a.type === 'Empty' ? '' : a.profile.name
    const bn = b.type === 'Empty' ? '' : b.profile.name
    return an.localeCompare(bn)
  })
  entry.modules.splice(0, entry.modules.length, ...sorted.map((m, i) => ({ ...m, slot: i + 1 }) as ModuleConfig))
}

const route = useRoute();
const forceId: string = route.params.forceId as string
const forceStore = useForcesStore();
const force = computed(() => forceStore.forceById(forceId));

const mods = computed(() => force.value?.mods)

const mergedPerkFlaws = computed(() => {
  const merged =  []
  if (entry.perks) {
    merged.push(...entry.perks)
  }
  if (entry.flaws) {
    merged.push(...entry.flaws)
  }
  return merged;
})

const perksFLawsModelOpen = ref(false)
const perkFlaw = reactive({
  name: '',
  type: 'Perk',
  effect: '',
})
const types = ['Perk', 'Flaw']

function addPerkOrFlaw() {
  const entryTemplate = {
    name: perkFlaw.name,
    type: perkFlaw.type as FeatType,
    effect: perkFlaw.effect,
  }
  if (entryTemplate.type === 'Perk') {
    if (!entry.perks) entry.perks = []
    entry.perks.push(entryTemplate)
  }
  if (entryTemplate.type === 'Flaw') {
    if (!entry.flaws) entry.flaws = []
    entry.flaws.push(entryTemplate)
  }
  perksFLawsModelOpen.value = false;
  perkFlaw.name = ''
  perkFlaw.type = ''
  perkFlaw.effect = ''
}

function removeFeat(type: FeatType, name: string) {
  if (type === 'Perk') {
    if (entry.perks) {
      const index = entry.perks.findIndex(item => item.name === name);
      entry.perks.splice(index, 1)
    }
  }
  if (type === 'Flaw') {
    if (entry.flaws) {
      const index = entry.flaws.findIndex(item => item.name === name);
      entry.flaws.splice(index, 1)
    }
  }
}

const pilotModelOpen = ref(false)
const pilotTemplate = reactive({
  name: '',
  rookie: false,
  trick: {
    name: '',
    type: 'Pilot Trick' as FeatType,
    effect: '',
  }
})
function addPilot() {
  entry.pilot = pilotTemplate;
  pilotModelOpen.value = false;
}

function removePilot() {
  entry.pilot = undefined;
}

</script>

<template>

  <div class="flex gap-2 justify-between items-center font-bold">
    <UInput v-model="entry.name" class="" size="xl"></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <div class="flex items-center gap-2">
    <span>Class</span>
    <UFieldGroup>
    <UButton
        v-for="n in 3"
        :key="n"
        color="info"
        :variant="entry.class === n ? 'solid' : 'outline'"
        class="cursor-pointer"
        @click="entry.class = n"
    >
      {{ n }}
    </UButton>
    </UFieldGroup>
    <span>MAC</span>
  </div>

  <!-- VARIANT: Perks & Flaws -->
  <template v-if="mods?.includes('Perks & Flaws')">
    <div>

      <span class="font-bold">
        <UIcon name="i-game-icons-power-lightning"></UIcon>
        Perks & Flaws:
      </span>

      <UBadge v-for="feat in mergedPerkFlaws" color="info" variant="subtle" class="ml-2">
        <UTooltip :delay-duration="0" :text="feat.effect">
          <span class="underline decoration-dotted" style="text-underline-offset: 4px">
            {{ feat.name }}
          </span>
        </UTooltip>
        <UIcon size="20" name="i-material-symbols-light-cancel-outline" color="error" class="cursor-pointer bg-error" @click="removeFeat(feat.type, feat.name)"></UIcon>
      </UBadge>

      <UModal
          v-model:open="perksFLawsModelOpen"
          title="Add Perk or Flaw"
          description="See pg. 52-53 from the MAC attack Rulebook."
      >
        <UButton
            color="info"
            variant="outline"
            size="sm"
            class="ml-2"
        >
          + Add Perk or Flaw
        </UButton>

        <template #body>
          <div class="flex flex-col gap-2">


            <UInput v-model="perkFlaw.name" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-4 w-full">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
                <span class="inline-flex bg-default px-1">Name</span>
              </label>
            </UInput>

            <URadioGroup
                v-model="perkFlaw.type"
                orientation="horizontal"
                default-value="Perk"
                :items="types"
                class="mb-4"
            >
            </URadioGroup>

            <UTextarea v-model="perkFlaw.effect" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-4" :rows="6" autoresize>
              <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
                <span class="inline-flex bg-default px-1">Effect / Description</span>
              </label>
            </UTextarea>

            <UButton @click="addPerkOrFlaw">Add Perk of Flaw</UButton>
          </div>
        </template>
      </UModal>

    </div>
  </template>

  <!-- VARIANT: Pilot Tricks -->
  <template v-if="mods?.includes('Pilot Tricks')">
    <div>

      <span class="font-bold">
        <UIcon name="i-game-icons-samus-helmet" class="mr-1"></UIcon>
        <span v-if="entry.pilot && entry.pilot.rookie">Rookie</span>
        <span v-else-if="entry.pilot && entry.pilot.trick">Ace</span>
        Pilot:
      </span>

      <UBadge v-if="entry.pilot" color="info" variant="subtle" class="ml-2">
        <UTooltip :delay-duration="0" :text="entry.pilot.rookie ? 'Rookie Pilot' : entry.pilot.trick.effect">
          <span class="underline decoration-dotted" style="text-underline-offset: 4px">
            {{ entry.pilot.name }}
          </span>
        </UTooltip>
        <UIcon size="20" name="i-material-symbols-light-cancel-outline" color="error" class="cursor-pointer bg-error" @click="removePilot"></UIcon>
      </UBadge>

      <UModal
          v-if="!entry.pilot"
          v-model:open="pilotModelOpen"
          title="Add Pilot - Rookie or Ace"
          description="See pg. 52-53 from the MAC attack Rulebook."
      >
        <UButton
            color="info"
            variant="outline"
            size="sm"
            class="ml-2"
        >
          + Add Ace Pilot
        </UButton>

        <template #body>
          <div class="flex flex-col gap-2">

            <UInput v-model="pilotTemplate.name" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-4 w-full">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
                <span class="inline-flex bg-default px-1">Pilot Name</span>
              </label>
            </UInput>

            <UCheckbox
                v-model="pilotTemplate.rookie"
                label="Rookie Pilot"
                description="A greenhorn pilot that needs to learn"
                class="mb-4 w-full"
            ></UCheckbox>

            <UInput v-model="pilotTemplate.trick.name" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-4 w-full" :disabled="pilotTemplate.rookie">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
                <span class="inline-flex bg-default px-1">Pilot Trick Name</span>
              </label>
            </UInput>

            <UTextarea v-model="pilotTemplate.trick.effect" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-4" :rows="6" autoresize :disabled="pilotTemplate.rookie">
              <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
                <span class="inline-flex bg-default px-1">Pilot Trick Effect</span>
              </label>
            </UTextarea>

            <UButton @click="addPilot">Add Ace Pilot</UButton>
          </div>
        </template>
      </UModal>

    </div>
  </template>

  <h3 class="text-lg font-bold flex items-center gap-2">
    Modules
    <UButton
        color="neutral"
        variant="outline"
        size="xs"
        icon="i-material-symbols-light-sort"
        title="Sort modules: ranged weapons, brawl weapons, hardware, empty"
        aria-label="Sort modules"
        class="cursor-pointer"
        @click="sortModules()"
    />
  </h3>

  <UPageList>
    <UPageCard
        v-for="(module, index) in entry.modules"
        :key="module.slot" class="mb-2"
        orientation="vertical"
        :ui="{ container: 'sm:p-4' }"
    >

      <EntryMacSlotEditor :clazz="entry.class" :module="module" :previous="entry.modules[index - 1]" :factionKey="factionKey" @setModule="setSlotModule(module.slot, $event)"></EntryMacSlotEditor>

    </UPageCard>

  </UPageList>

</template>

<style scoped>

</style>