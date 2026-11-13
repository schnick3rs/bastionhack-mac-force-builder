<script setup lang="ts">
import type {ArsenalEntry} from "#shared/utils/arsenal";

useHead({ title: 'Arsenal | MACtory' })

const { data } = await useFetch<ArsenalEntry[]>('/api/arsenal')
const weapons = computed(() => data.value ?? [])

const search = ref('')
const notableOnly = ref(false)

type SortKey = 'code' | 'name' | 'range' | 'type' | 'power'
const sortKey = ref<SortKey | null>(null)
const sortDesc = ref(false)

const order: Record<string, string[]> = {
  range: ['Short', 'Long', 'Arc', 'Brawl'],
  type: ['Burst', 'Piercing', 'Guided', 'Multi'],
}

function sortBy(key: SortKey) {
  if (sortKey.value === key) sortDesc.value = !sortDesc.value
  else { sortKey.value = key; sortDesc.value = false }
}

const rows = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = weapons.value.filter(w => {
    if (notableOnly.value && !w.notable) return false
    if (!q) return true
    return [w.code, w.name, w.range, w.type, ...w.subtypes, ...w.factions.map(f => f.name)]
        .some(v => v.toLowerCase().includes(q))
  })
  const key = sortKey.value
  if (key) {
    const dir = sortDesc.value ? -1 : 1
    list = [...list].sort((a, b) => {
      if (key === 'power') return (a.power - b.power) * dir
      if (key === 'range' || key === 'type') return (order[key]!.indexOf(a[key]) - order[key]!.indexOf(b[key])) * dir
      return a[key].localeCompare(b[key]) * dir
    })
  }
  return list
})

const columns: { key: SortKey, label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'range', label: 'Range' },
  { key: 'type', label: 'Type' },
  { key: 'power', label: 'Power' },
]
</script>

<template>
  <div class="pb-12">

    <div class="mb-6">
      <h1 class="text-3xl font-bold">Arsenal</h1>
      <p class="text-sm text-muted">
        A reference of the notable weapons and the weapons used in the example forces of the factions.
        Weapons are written as range, type, power and subtype, e.g. <code>LB2-TX</code> is a long burst weapon with power 2,
        thermal and expendable.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <UInput v-model="search" icon="i-material-symbols-light-search" placeholder="Search weapons, factions, ..." class="w-full sm:w-80" />
      <USwitch v-model="notableOnly" label="Notable only" />
      <span class="text-sm text-muted ml-auto">{{ rows.length }} of {{ weapons.length }} weapons</span>
    </div>

    <div class="overflow-x-auto rounded-xl border border-default">
      <table class="w-full text-sm">
        <thead class="bg-elevated/60 text-left">
          <tr>
            <th v-for="c in columns" :key="c.key" class="px-3 py-2 font-semibold whitespace-nowrap">
              <button type="button" class="inline-flex items-center gap-1 cursor-pointer" @click="sortBy(c.key)">
                {{ c.label }}
                <UIcon
                    v-if="sortKey === c.key"
                    :name="sortDesc ? 'i-material-symbols-light-arrow-downward' : 'i-material-symbols-light-arrow-upward'"
                    class="size-4"
                />
              </button>
            </th>
            <th class="px-3 py-2 font-semibold whitespace-nowrap">Subtype</th>
            <th class="px-3 py-2 font-semibold whitespace-nowrap">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr v-for="w in rows" :key="w.key" class="align-top">
            <td class="px-3 py-2 font-mono whitespace-nowrap">{{ w.code }}</td>
            <td class="px-3 py-2">
              <div class="font-semibold">{{ w.name }}</div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">{{ w.range }}</td>
            <td class="px-3 py-2 whitespace-nowrap">{{ w.type }}</td>
            <td class="px-3 py-2">{{ w.power }}</td>
            <td class="px-3 py-2">
              <div class="flex flex-wrap gap-1">
                <UBadge v-for="s in w.subtypes" :key="s" color="neutral" variant="subtle" size="sm">{{ s }}</UBadge>
              </div>
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-wrap gap-1">
                <UBadge v-if="w.notable" color="warning" variant="subtle" size="sm">Notable</UBadge>
                <UBadge v-for="f in w.factions" :key="f.key" color="info" variant="subtle" size="sm" :avatar="{ src: `/factions/${f.key}-symbol.png`, alt: f.name }">
                  {{ f.name }}
                </UBadge>
              </div>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="7" class="px-3 py-6 text-center text-muted">No weapon matches.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
