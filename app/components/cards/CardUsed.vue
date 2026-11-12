<script setup lang="ts">
withDefaults(defineProps<{ label?: boolean }>(), { label: true })
</script>

<template>
  <span class="c-used"><span v-if="label" class="c-used-label">USED</span><span class="c-box c-box-sm"></span></span>
</template>
