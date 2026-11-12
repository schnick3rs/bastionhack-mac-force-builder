<script setup lang="ts">
import type {MAC} from "~~/types/unit";
import type {MacCard, MacRow} from "#shared/utils/cards";
import {usePlayStore} from "~/stores/play";

const props = defineProps<{
  card: MacCard
  entry: MAC
  forceId: string
  showRules: boolean
  mods: string[]
}>()
const division = defineModel<number | undefined>('division', { required: true })

const play = usePlayStore()
const base = computed(() => `${props.forceId}|${props.card.id}`)

// all internal damage boxes ticked off: the MAC is gone, fold away modules and rules (can be reopened)
const destroyed = computed(() => props.card.internalBoxes > 0 && play.get(`${base.value}|internal`) >= props.card.internalBoxes)
const expanded = ref(false)
watch(destroyed, () => { expanded.value = false })

const slotKey = (slot: number) => `${base.value}|dmg|${slot}`
const usedKey = (row: MacRow) => `${base.value}|used|${row.slots[0]}`
const isDouble = (slot: number) => {
  const m = props.entry.modules.find(m => m.slot === slot)
  return !!m && m.type !== 'Empty' && m.double
}

function slotTile(slot: number) {
  const v = play.get(slotKey(slot))
  if (v >= 2) return 'border-error text-error'
  if (v === 1) return 'border-warning text-warning'
  return 'border-accented'
}

const hasExtras = computed(() =>
    (props.mods.includes('Pilot Tricks') && props.entry.pilot) ||
    (props.mods.includes('Perks & Flaws') && (props.entry.perks?.length || props.entry.flaws?.length)))
</script>

<template>
  <div class="rounded-xl border border-default bg-elevated/40 overflow-hidden print:break-inside-avoid">

    <div class="flex items-center gap-3 p-4">
      <PlayActivation :activation="card.activation" />
      <div class="flex-1 min-w-0">
        <div class="text-xl font-bold truncate">{{ card.name }}</div>
        <div class="flex gap-1.5 mt-1">
          <UBadge color="neutral" variant="subtle" size="sm">Class {{ card.cls }} MAC</UBadge>
          <UBadge color="warning" variant="subtle" size="sm">{{ card.pts }} pts</UBadge>
        </div>
      </div>
      <PlayDivision v-model="division" />
    </div>

    <div class="flex items-center gap-3 px-4 py-2.5 border-y border-default bg-elevated/60">
      <span class="text-[11px] uppercase tracking-wider text-muted">Internal damage</span>
      <PlayBoxes :mark-key="`${base}|internal`" :count="card.internalBoxes" />
      <UButton
          v-if="destroyed"
          size="xs"
          color="neutral"
          variant="ghost"
          class="ml-auto cursor-pointer"
          :trailing-icon="expanded ? 'i-material-symbols-light-keyboard-arrow-up' : 'i-material-symbols-light-keyboard-arrow-down'"
          @click="expanded = !expanded"
      >
        Destroyed
      </UButton>
    </div>

    <div v-if="!destroyed || expanded" :class="{ 'opacity-60': destroyed }">

    <div class="p-4 flex flex-col gap-3">

      <template v-if="card.zeroRow">
        <div class="flex gap-3 items-start">
          <div class="flex items-center gap-1.5 shrink-0">
            <div class="size-11 rounded-lg border-2 flex items-center justify-center text-lg font-bold" :class="slotTile(0)">0</div>
            <PlayBoxes :mark-key="slotKey(0)" :count="2" mode="damage" size="sm" vertical />
          </div>
          <div class="flex-1 min-w-0 pt-1">
            <div class="font-semibold">{{ card.zeroRow.name }}</div>
            <div v-if="showRules && card.zeroRow.fullRule" class="text-sm text-muted">{{ card.zeroRow.fullRule }}</div>
          </div>
        </div>
        <div v-if="showRules && card.zeroRule" class="rounded-lg bg-elevated px-3 py-2 text-sm">
          <b>{{ card.zeroRule.name }}:</b> {{ card.zeroRule.text }}
        </div>
        <hr class="border-default">
      </template>

      <div v-for="(row, i) in card.rows" :key="i" class="flex gap-3 items-start">

        <div class="flex flex-col gap-1.5 shrink-0 relative">
          <span v-if="row.slots.length > 1" class="absolute -left-2.5 top-5.5 bottom-5.5 w-2 border border-r-0 border-accented rounded-l"></span>
          <div v-for="s in row.slots" :key="s" class="flex items-center gap-1.5">
            <div class="size-11 rounded-lg border-2 flex items-center justify-center text-lg font-bold" :class="slotTile(s)">{{ s }}</div>
            <PlayBoxes :mark-key="slotKey(s)" :count="2" mode="damage" size="sm" vertical />
          </div>
        </div>

        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-center justify-between gap-2">
            <span class="font-semibold" :class="{ 'text-muted font-normal': row.empty }">
              {{ row.name }}
              <UBadge v-if="row.slots.some(isDouble)" color="neutral" variant="subtle" size="sm">x2</UBadge>
            </span>
            <label v-if="row.used" class="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted cursor-pointer rounded-md border border-default px-2 py-1">
              <PlayBoxes :mark-key="usedKey(row)" :count="1" size="sm" />
              Used
            </label>
          </div>
          <div v-if="showRules && row.fullRule" class="text-sm text-muted">{{ row.fullRule }}</div>
        </div>

      </div>
    </div>

    <div v-if="hasExtras" class="mx-4 mb-4 flex flex-col gap-1 text-sm">
      <p v-if="mods.includes('Pilot Tricks') && entry.pilot">
        <UIcon name="i-game-icons-samus-helmet" class="mr-1" />
        <b>{{ entry.pilot.name }}:</b>
        <template v-if="entry.pilot.rookie"> Rookie Pilot</template>
        <template v-else-if="entry.pilot.trick"> {{ entry.pilot.trick.effect }}</template>
      </p>
      <template v-if="mods.includes('Perks & Flaws')">
        <p v-for="feat in [...(entry.perks ?? []), ...(entry.flaws ?? [])]" :key="feat.name">
          <UIcon name="i-game-icons-power-lightning" class="mr-1" />
          <b>{{ feat.name }}:</b> {{ feat.effect }}
        </p>
      </template>
    </div>

    <div v-if="showRules && card.faction" class="mx-4 mb-4 rounded-lg bg-elevated px-3 py-2 text-sm">
      <b>{{ card.faction.name }}:</b> {{ card.faction.text }}
    </div>

    <div class="mx-4 mb-4 print:hidden">
      <UTextarea class="w-full" :rows="2" placeholder="Notes: perks, flaws, pilot skills, ..." />
    </div>

    </div>
  </div>
</template>
