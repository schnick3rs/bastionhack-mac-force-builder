<script setup lang="ts">
import type {FactionBox} from "#shared/utils/cards";
defineProps<{ box: FactionBox }>()
</script>

<template>
  <div class="c-faction"><b>{{ box.name }}:</b> {{ box.text }}</div>
</template>
