<script setup lang="ts">
import type {PilotPair} from "#shared/utils/cards";
defineProps<{ card: PilotPair }>()
</script>

<template>
  <!-- one A8L card, two half height pilot cards stacked -->
  <div class="c-pair">
    <CardsCardPilot :card="card.cards[0]" />
    <CardsCardPilot v-if="card.cards[1]" :card="card.cards[1]" />
    <div v-else class="card half empty"></div>
  </div>
</template>
