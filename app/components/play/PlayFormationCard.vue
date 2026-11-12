<script setup lang="ts">
import type {FormationCard} from "#shared/utils/cards";

const props = defineProps<{ card: FormationCard, forceId: string, showRules: boolean }>()
const division = defineModel<number | undefined>('division', { required: true })

import {usePlayStore} from "~/stores/play";

const play = usePlayStore()
const base = computed(() => `${props.forceId}|${props.card.id}`)

// all losses ticked off: the formation is gone, fold away weapons and rules (can be reopened)
const destroyed = computed(() => props.card.solid > 0 && play.get(`${base.value}|losses`) >= props.card.solid)
const expanded = ref(false)
watch(destroyed, () => { expanded.value = false })
const sub = computed(() => props.card.sub.replace('Class 0 ', ''))
</script>

<template>
  <div class="rounded-xl border border-default bg-elevated/40 overflow-hidden print:break-inside-avoid">

    <div class="flex items-center gap-3 p-3">
      <PlayActivation :activation="card.activation" />
      <div class="flex-1 min-w-0">
        <div class="text-lg font-bold leading-tight">{{ card.title }}</div>
        <div class="text-xs text-muted">{{ sub }}</div>
      </div>
      <PlayDivision v-model="division" />
    </div>

    <div class="flex items-center gap-3 px-3 py-2.5 border-y border-default bg-elevated/60">
      <span class="text-[11px] uppercase tracking-wider text-muted">Losses</span>
      <PlayBoxes :mark-key="`${base}|losses`" :count="card.solid" />
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

    <div v-if="!destroyed || expanded" class="p-3 flex flex-col gap-2" :class="{ 'opacity-60': destroyed }">
      <div v-if="showRules" class="text-xs text-muted">{{ card.helper }}</div>

      <div v-for="(w, i) in card.weapons" :key="i" class="flex items-center justify-between gap-2">
        <span class="font-semibold">{{ w.name }}</span>
        <label v-if="w.used" class="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted cursor-pointer rounded-md border border-default px-2 py-1">
          <PlayBoxes :mark-key="`${base}|used|${i}`" :count="1" size="sm" />
          Used
        </label>
      </div>

      <div v-for="h in card.hardware" :key="h.name">
        <div class="font-semibold">{{ h.name }}</div>
        <div v-if="showRules && h.rule" class="text-xs text-muted">{{ h.rule }}</div>
      </div>
      <div v-if="!card.hardware.length" class="text-xs text-muted">No hardware</div>

      <div v-if="showRules && card.faction" class="rounded-lg bg-elevated px-3 py-2 text-sm">
        <b>{{ card.faction.name }}:</b> {{ card.faction.text }}
      </div>
    </div>
  </div>
</template>
