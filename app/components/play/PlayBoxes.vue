<script setup lang="ts">
import {usePlayStore} from "~/stores/play";

/** A row of toggleable boxes, backed by one counter in the play store. */
const props = defineProps<{
  markKey: string
  count: number
  /** `damage` = first mark yellow, second turns everything red */
  mode?: 'danger' | 'damage'
  size?: 'sm' | 'md'
  vertical?: boolean
}>()

const play = usePlayStore()
const value = computed(() => play.get(props.markKey))

function filledClass(i: number) {
  if (i >= value.value) return 'border-accented bg-transparent'
  if (props.mode === 'damage' && value.value === 1) return 'bg-warning border-warning'
  return 'bg-error border-error'
}
</script>

<template>
  <span class="inline-flex gap-1.5" :class="vertical ? 'flex-col' : 'flex-row'">
    <button
        v-for="i in count"
        :key="i"
        type="button"
        class="border-2 rounded cursor-pointer transition-colors"
        :class="[filledClass(i - 1), size === 'sm' ? 'size-3.5' : 'size-6']"
        :aria-label="`Mark ${i}`"
        @click="play.toggleBox(markKey, i - 1)"
    />
  </span>
</template>
