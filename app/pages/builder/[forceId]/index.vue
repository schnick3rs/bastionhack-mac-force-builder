<script setup lang="ts">

import {useForcesStore} from "~/stores/forces";

const force = useForcesStore()



const { data: hardware, status } = await useFetch('/api/hardware', {
  key: 'typicode-users',
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(hardware => ({
      label: hardware.name,
      value: hardware.key,
      hint: hardware.effect,
    }))
  },
  lazy: true
})

const module = ref('')

</script>

<template>

  <h1>Build your force: {{ force.name }}</h1>

  <h2>Rooster</h2>

  <ul>
    <li v-for="unit in force.units">{{ unit.id }}</li>
  </ul>

  <UPageCard>

    <UInput placeholder="Unit Name"></UInput>

    <h3>Class 3</h3>

    <h3>Modules</h3>

    <USelectMenu
        v-model="module"
        :items="hardware"
        :loading="status === 'pending'"
        size="xl"
    >
      <template #item-label="{ item }">
        {{ item.label }}
        <div class="text-muted">
          {{ item.hint }}
        </div>
      </template>
    </USelectMenu>

  </UPageCard>

</template>

<style scoped>

</style>