<script setup lang="ts">

</script>

<template>
  <USelect
      v-model="state.faction"
      :items="factions"
      :loading="status === 'pending'"
      size="xl"
  >
    <template #item-label="{ item }">
      {{ item.label }}
      <div class="text-muted">
        {{ item.hint }}
      </div>
    </template>
  </USelect>
</template>

<style scoped>

</style>