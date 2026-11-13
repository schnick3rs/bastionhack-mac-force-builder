<script setup lang="ts">
import type {Feat, FeatType} from "~~/types/unit";
import {flaws, perks} from "~~/server/data/perkFlawRepository";

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ type?: FeatType }>()
const emit = defineEmits<{ select: [feat: Feat] }>()

const filters: FeatType[] = ['Perk', 'Flaw']
const active = ref<FeatType[]>([])

function toggle(type: FeatType) {
  const i = active.value.indexOf(type)
  if (i >= 0) active.value.splice(i, 1)
  else active.value.push(type)
}

const filtered = computed(() => {
  // a fixed type (only perks or only flaws) wins over the filter chips
  if (props.type) return props.type === 'Perk' ? perks : flaws
  const all = [...perks, ...flaws]
  if (!active.value.length) return all
  return all.filter(f => active.value.includes(f.type))
})

function select(feat: Feat) {
  emit('select', { ...feat })
  open.value = false
}
</script>

<template>
  <UModal
      v-model:open="open"
      :title="type ? `Select ${type}` : 'Select Perk or Flaw'"
      description="See pg. 52-53 from the MAC attack Rulebook."
      :ui="{ content: 'max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:w-full max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none sm:h-[80vh] sm:max-h-[80vh] flex flex-col', body: 'flex-1 min-h-0 overflow-y-auto' }"
  >
    <template #body>
      <div v-if="!type" class="flex flex-wrap gap-1 pb-3">
        <UButton
            v-for="t in filters"
            :key="t"
            size="xs"
            :color="t === 'Perk' ? 'success' : 'error'"
            :variant="active.includes(t) ? 'solid' : 'outline'"
            class="cursor-pointer"
            @click="toggle(t)"
        >
          {{ t }}s
        </UButton>
      </div>
      <ul class="flex flex-col divide-y divide-default">
        <li v-for="feat in filtered" :key="`${feat.type}-${feat.name}`">
          <button
              type="button"
              class="w-full text-left px-2 py-3 cursor-pointer hover:bg-elevated rounded flex flex-col gap-1"
              @click="select(feat)"
          >
            <span class="font-medium flex items-center gap-1">
              {{ feat.name }}
              <UBadge size="sm" :color="feat.type === 'Perk' ? 'success' : 'error'" variant="subtle" class="font-normal">{{ feat.type }}</UBadge>
            </span>
            <span class="text-sm text-muted">{{ feat.effect }}</span>
          </button>
        </li>
      </ul>
    </template>
  </UModal>
</template>
