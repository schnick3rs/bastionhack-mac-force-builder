<script setup lang="ts">
import type {AssetCard} from "#shared/utils/cards";
defineProps<{ card: AssetCard }>()
</script>

<template>
  <div class="card a8">
    <CardsCardHeader :activation="card.activation" :title="card.title" :sub="card.sub" no-division />
    <div class="c-rule c-rule-mod">{{ card.effect }}</div>
  </div>
</template>
