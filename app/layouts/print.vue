<script setup lang="ts">



</script>

<template>
  <UApp>

    <UMain class="print-main bg-black">
      <UContainer class="bg-white print-container">
        <slot />
      </UContainer>
    </UMain>

  </UApp>
</template>

<style scoped>
@media print {
  .print-main {
    margin: unset;
    padding: 0 !important;
    background-color: unset;
  }
}
</style>
