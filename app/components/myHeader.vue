<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute();
const forceId = computed(() => route.params.forceId|| null)

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'MAC Attack on Backerkit',
    to: 'https://www.backerkit.com/c/projects/bastionland-press/mac-attack-sci-fi-mecha-miniature-wargame?ref=bk-discover-user-profile',
    target: '_blank'
  },
  {
    label: 'Bastionland',
    to: 'https://www.bastionland.com/',
    target: '_blank'
  }
])
</script>

<template>
  <UHeader class="print:hidden">
    <template #title>
      <NuxtImg src="android-chrome-192x192.png" width="32" height="32" alt="MACtory Website Logo - Gear before sunset"></NuxtImg>
      MACtory
    </template>
    <UNavigationMenu :items="items" />

    <template #right>
      <UButton v-if="forceId" :to="`/builder/${forceId}/view`" color="neutral" variant="ghost" size="xl" icon="i-material-symbols-light-table-eye-outline"></UButton>
      <UColorModeButton />
    </template>
  </UHeader>
</template>

<style>
</style>