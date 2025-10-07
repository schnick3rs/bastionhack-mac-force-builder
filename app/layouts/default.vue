<script setup lang="ts">



</script>

<template>
  <UApp>
    <my-header />

    <UMain>
      <UContainer class="mt-8 print:mt-0">
        <slot />
      </UContainer>
    </UMain>

  </UApp>
</template>

