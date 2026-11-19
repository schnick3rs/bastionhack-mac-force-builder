<script setup lang="ts">
import {hardwareTags} from "~~/types/unit";
import type {HardwareTag, ModuleReference} from "~~/types/unit";

useHead({ title: 'Modules | MACtory' })

const { data } = await useFetch<ModuleReference[]>('/api/hardware/all')
const modules = computed(() => data.value ?? [])

type UnitType = 'MAC' | 'Infantry' | 'Vehicle'
const unitTypes: { key: UnitType, icon: string }[] = [
  { key: 'MAC', icon: 'i-game-icons-missile-mech' },
  { key: 'Infantry', icon: 'i-game-icons-dark-squad' },
  { key: 'Vehicle', icon: 'i-game-icons-tank' },
]

const search = ref('')
const activeTypes = ref<UnitType[]>([])
const activeTags = ref<HardwareTag[]>([])

function toggle<T>(list: T[], v: T) {
  const i = list.indexOf(v)
  if (i >= 0) list.splice(i, 1)
  else list.push(v)
}

const usableBy = (m: ModuleReference): UnitType[] =>
    m.usability.includes('All') ? unitTypes.map(u => u.key) : m.usability.filter((u): u is UnitType => u !== 'All')

const originLabel = (m: ModuleReference) => m.faction?.name ?? 'Common'

type SortKey = 'name' | 'effect' | UnitType | 'tags' | 'origin'
const sortKey = ref<SortKey>('name')
const sortDesc = ref(false)

function sortBy(key: SortKey) {
  if (sortKey.value === key) sortDesc.value = !sortDesc.value
  else { sortKey.value = key; sortDesc.value = false }
}

const sortValue = (m: ModuleReference, key: SortKey): string => {
  switch (key) {
    case 'name': return m.name
    case 'effect': return m.effect
    case 'tags': return [...m.tags].sort().join(',')
    case 'origin': return m.faction ? `1${m.faction.name}` : '0'
    default: return usableBy(m).includes(key) ? '0' : '1'
  }
}

const rows = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = modules.value.filter(m => {
    if (activeTypes.value.length && !activeTypes.value.some(t => usableBy(m).includes(t))) return false
    if (activeTags.value.length && !m.tags.some(t => activeTags.value.includes(t))) return false
    if (!q) return true
    return [m.name, m.effect, originLabel(m), ...m.tags].some(v => v.toLowerCase().includes(q))
  })
  const dir = sortDesc.value ? -1 : 1
  return list.sort((a, b) => sortValue(a, sortKey.value).localeCompare(sortValue(b, sortKey.value)) * dir
      || a.name.localeCompare(b.name))
})

const columns: { key: SortKey, label: string, icon?: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'effect', label: 'Effect' },
  ...unitTypes.map(u => ({ key: u.key, label: u.key, icon: u.icon })),
  { key: 'tags', label: 'Tags' },
  { key: 'origin', label: 'Origin' },
]
</script>

<template>
  <div class="pb-12">

    <div class="mb-6">
      <h1 class="text-3xl font-bold">Modules</h1>
      <p class="text-sm text-muted">A reference of all common and faction modules.</p>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-3">
      <UInput v-model="search" icon="i-material-symbols-light-search" placeholder="Search modules, effects, ..." class="w-full sm:w-80" />
      <div class="flex gap-1">
        <UButton
            v-for="u in unitTypes"
            :key="u.key"
            size="xs"
            color="info"
            :icon="u.icon"
            :variant="activeTypes.includes(u.key) ? 'solid' : 'outline'"
            class="cursor-pointer"
            @click="toggle(activeTypes, u.key)"
        >{{ u.key }}</UButton>
      </div>
      <span class="text-sm text-muted ml-auto">{{ rows.length }} of {{ modules.length }} modules</span>
    </div>

    <div class="flex flex-wrap gap-1 mb-4">
      <UButton
          v-for="tag in hardwareTags"
          :key="tag"
          size="xs"
          color="info"
          :variant="activeTags.includes(tag) ? 'solid' : 'outline'"
          class="cursor-pointer capitalize"
          @click="toggle(activeTags, tag)"
      >{{ tag }}</UButton>
      <UButton
          v-if="activeTags.length || activeTypes.length"
          size="xs" color="neutral" variant="ghost" class="cursor-pointer"
          @click="activeTags = []; activeTypes = []"
      >Clear</UButton>
    </div>

    <div class="overflow-x-auto rounded-xl border border-default">
      <table class="w-full text-sm">
        <thead class="bg-elevated/60 text-left">
          <tr>
            <th v-for="c in columns" :key="c.key" class="px-3 py-2 font-semibold whitespace-nowrap">
              <button type="button" class="inline-flex items-center gap-1 cursor-pointer" @click="sortBy(c.key)">
                <UIcon v-if="c.icon" :name="c.icon" class="size-5" />
                {{ c.label }}
                <UIcon
                    v-if="sortKey === c.key"
                    :name="sortDesc ? 'i-material-symbols-light-arrow-downward' : 'i-material-symbols-light-arrow-upward'"
                    class="size-4"
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="m in rows" :key="m.key" class="align-top">
            <td class="px-3 py-2 font-semibold whitespace-nowrap">{{ m.name }}</td>
            <td class="px-3 py-2 min-w-72">{{ m.effect }}</td>
            <td v-for="u in unitTypes" :key="u.key" class="px-3 py-2 text-center">
              <UIcon v-if="usableBy(m).includes(u.key)" name="i-material-symbols-light-check" class="size-5 text-success" :title="`Usable by ${u.key}`" />
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-wrap gap-1">
                <UBadge v-for="t in m.tags" :key="t" color="neutral" variant="subtle" size="sm" class="capitalize">{{ t }}</UBadge>
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <UBadge
                  v-if="m.faction" color="info" variant="subtle" size="sm"
                  :avatar="{ src: `/factions/${m.faction.key}-symbol.png`, alt: m.faction.name }"
              >{{ m.faction.name }}</UBadge>
              <span v-else class="text-muted">Common</span>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="7" class="px-3 py-6 text-center text-muted">No module matches.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
