<script setup lang="ts">



</script>

<template>
  <UApp>
    <my-header />

    <UMain>
      <UContainer class="mt-8">
        <slot />
      </UContainer>
    </UMain>

    <my-footer />
  </UApp>
</template>

