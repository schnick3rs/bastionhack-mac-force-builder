<script setup lang="ts">
import type {RemoteAssetDefinition, RemoteAssetTag} from "~~/types/unit";
import {remoteAssetTags} from "~~/types/unit";
import remoteAssets from "~~/server/data/remoteAssetRepository";

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [asset: RemoteAssetDefinition] }>()

const activeTags = ref<RemoteAssetTag[]>([])

function toggleTag(tag: RemoteAssetTag) {
  const i = activeTags.value.indexOf(tag)
  if (i >= 0) activeTags.value.splice(i, 1)
  else activeTags.value.push(tag)
}

const filtered = computed(() => {
  if (!activeTags.value.length) return remoteAssets
  return remoteAssets.filter(a => a.tags.some(t => activeTags.value.includes(t)))
})

function select(asset: RemoteAssetDefinition) {
  emit('select', asset)
  open.value = false
}
</script>

<template>
  <UModal
      v-model:open="open"
      title="Select Remote Asset"
      description="See pg. 54-55 from the MAC attack Rulebook."
      :ui="{ content: 'max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:w-full max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none sm:h-[80vh] sm:max-h-[80vh] flex flex-col', body: 'flex-1 min-h-0 overflow-y-auto' }"
  >
    <template #body>
      <div class="flex flex-wrap gap-1 pb-3">
        <UButton
            v-for="tag in remoteAssetTags"
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
      <p v-if="!filtered.length" class="text-muted text-sm">No remote assets match the selected tags.</p>
      <ul class="flex flex-col divide-y divide-default">
        <li v-for="asset in filtered" :key="asset.key">
          <button
              type="button"
              class="w-full text-left px-2 py-3 cursor-pointer hover:bg-elevated rounded flex flex-col gap-1"
              @click="select(asset)"
          >
            <span class="font-medium flex items-center gap-1 flex-wrap">
              {{ asset.name }}
              <UBadge size="sm" color="warning" variant="subtle" class="font-normal">{{ asset.cost }} pt</UBadge>
              <UBadge v-for="t in asset.tags" :key="t" size="sm" color="neutral" variant="subtle" class="capitalize font-normal">{{ t }}</UBadge>
            </span>
            <span class="text-sm text-muted">{{ asset.effect }}</span>
          </button>
        </li>
      </ul>
    </template>
  </UModal>
</template>
