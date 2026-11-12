<script setup lang="ts">
const division = defineModel<number | undefined>({ required: true })
const letters = ['A', 'B', 'C']

function pick(n: number) {
  division.value = division.value === n ? undefined : n
}
</script>

<template>
  <div class="flex flex-col items-end gap-1">
    <span class="text-[10px] uppercase tracking-wider text-muted">Division</span>
    <UFieldGroup>
      <UButton
          v-for="(l, i) in letters"
          :key="l"
          size="md"
          color="info"
          :variant="division === i + 1 ? 'solid' : 'subtle'"
          class="cursor-pointer min-w-9 justify-center"
          @click="pick(i + 1)"
      >
        {{ l }}
      </UButton>
    </UFieldGroup>
  </div>
</template>
