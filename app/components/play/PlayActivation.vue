<script setup lang="ts">
import type {Activation} from "#shared/utils/cards";
import {suitSymbol} from "#shared/utils/cards";
defineProps<{ activation: Activation }>()
</script>

<template>
  <div class="relative w-10 h-14 shrink-0 rounded-md bg-white text-black border border-black/30">
    <span class="absolute top-1 left-1.5 text-sm font-bold leading-none">{{ activation.rank }}</span>
    <span class="absolute bottom-1 right-1.5 text-base leading-none">{{ suitSymbol[activation.suit] }}</span>
  </div>
</template>
