<script setup lang="ts">
import type {Activation} from "#shared/utils/cards";
import {suitSymbol} from "#shared/utils/cards";

defineProps<{ activation: Activation, title: string, sub: string, division?: number }>()

// letters sit in the centre of three sectors: A top-right, B bottom, C top-left
const letters = [
  { l: 'A', x: 16, y: 8.4 },
  { l: 'B', x: 12, y: 18.6 },
  { l: 'C', x: 8, y: 8.4 },
]
</script>

<template>
  <div class="c-head">
    <div class="c-act">
      <span class="c-act-rank">{{ activation.rank }}</span>
      <span class="c-act-suit">{{ suitSymbol[activation.suit] }}</span>
    </div>
    <div class="c-head-text">
      <div class="c-title">{{ title }}</div>
      <div class="c-sub">{{ sub }}</div>
    </div>
    <svg class="c-div" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="11.3" fill="none" stroke="#1a1a1a" stroke-width="1.4"/>
      <line x1="12" y1="12" x2="12" y2="0.7" stroke="#1a1a1a" stroke-width="1.4"/>
      <line x1="12" y1="12" x2="21.8" y2="17.65" stroke="#1a1a1a" stroke-width="1.4"/>
      <line x1="12" y1="12" x2="2.2" y2="17.65" stroke="#1a1a1a" stroke-width="1.4"/>
      <text v-for="(t, i) in letters" :key="t.l" :x="t.x" :y="t.y + 1.6" text-anchor="middle"
            font-size="5" font-family="Inter, sans-serif"
            :fill="division === i + 1 ? '#1a1a1a' : '#b5b5b5'" :font-weight="division === i + 1 ? 700 : 400">{{ t.l }}</text>
    </svg>
  </div>
</template>
