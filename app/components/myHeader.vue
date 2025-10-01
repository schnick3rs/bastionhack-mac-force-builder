<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'


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
  <UHeader title="MACtory">

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
