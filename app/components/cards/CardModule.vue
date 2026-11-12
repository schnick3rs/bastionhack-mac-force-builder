<script setup lang="ts">
import type {ModuleCard} from "#shared/utils/cards";
defineProps<{ card: ModuleCard }>()
</script>

<template>
  <div class="card a8">
    <div class="c-head">
      <div class="c-mod-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1a1a1a" stroke-width="1.6"><path d="M4 10l8-6 8 6v10H4z"/><rect x="9" y="13" width="6" height="7"/></svg>
      </div>
      <div class="c-head-text">
        <div class="c-title">{{ card.name }}</div>
        <div class="c-sub">{{ card.sub }}</div>
      </div>
    </div>
    <div class="c-rule c-rule-mod">{{ card.rule }}</div>
    <div class="c-au-row c-au-row-mod">
      <div v-for="i in card.slots" :key="i" class="c-au">AU {{ i }}</div>
    </div>
  </div>
</template>
