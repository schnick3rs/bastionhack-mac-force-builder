<script setup lang="ts">
import type {HardwareModule, HardwareTag} from "~~/types/unit";
import {hardwareTags} from "~~/types/unit";

const open = defineModel<boolean>('open', { default: false })

const { items, factionKey, selected } = defineProps<{
  items: HardwareModule[],
  factionKey: string | undefined,
  selected?: string
}>()

const emit = defineEmits<{ select: [name: string] }>()

const activeTags = ref<HardwareTag[]>([])

function toggleTag(tag: HardwareTag) {
  const i = activeTags.value.indexOf(tag)
  if (i >= 0) activeTags.value.splice(i, 1)
  else activeTags.value.push(tag)
}

const filtered = computed(() => {
  if (!activeTags.value.length) return items
  return items.filter(h => h.tags?.some(t => activeTags.value.includes(t)))
})

function select(name: string) {
  emit('select', name)
  open.value = false
}
</script>

<template>
  <UModal
      v-model:open="open"
      title="Select Hardware"
      :ui="{ content: 'max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:w-full max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none sm:h-[80vh] sm:max-h-[80vh] flex flex-col', body: 'flex-1 min-h-0 overflow-y-auto' }"
  >
    <template #body>
      <div class="flex flex-wrap gap-1 pb-3">
        <UButton
            v-for="tag in hardwareTags"
            :key="tag"
            size="xs"
            color="info"
            :variant="activeTags.includes(tag) ? 'solid' : 'outline'"
            class="cursor-pointer capitalize"
            @click="toggleTag(tag)"
        >
          {{ tag }}
        </UButton>
        <UButton
            v-if="activeTags.length"
            size="xs"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="activeTags = []"
        >
          Clear
        </UButton>
      </div>
      <p v-if="!filtered.length" class="text-muted text-sm">No hardware matches the selected tags.</p>
      <ul class="flex flex-col divide-y divide-default">
        <li v-for="item in filtered" :key="item.name">
          <button
              type="button"
              class="w-full text-left px-2 py-3 cursor-pointer hover:bg-elevated rounded flex flex-col gap-1"
              :class="{ 'bg-elevated': item.name === selected }"
              @click="select(item.name)"
          >
            <span class="font-medium flex items-center gap-1">
              {{ item.name }}
              <UAvatar v-if="factionKey && item.origin === 'faction'" :src="`/factions/${factionKey}-symbol.png`" class="size-4"/>
              <UBadge v-for="t in item.tags" :key="t" size="sm" color="neutral" variant="subtle" class="capitalize font-normal">{{ t }}</UBadge>
            </span>
            <span class="text-sm text-muted">{{ item.effect }}</span>
          </button>
        </li>
      </ul>
    </template>
  </UModal>
</template>
