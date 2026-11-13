<script setup lang="ts">
// demo page, only available when running locally
if (!useIsLocalhost()) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({ title: 'Tech Tree Demo | MACtory' })

interface UnlockView {
  category: string
  property?: string
  value: string | number
  restriction?: string
  label: string
}

interface TechNode {
  key: string
  name: string
  tier: 'basic' | 'advanced'
  unlocks: UnlockView[]
  neighbours: string[]
}

interface Access {
  maxMacClass: number
  units: string[]
  weapons: { maxPower: number, ranges: string[], types: string[], subtypes: string[] }
  rules: string[]
  hardware: { name: string, usableBy: string[] | null }[]
}

interface AvailableResponse {
  unlocked: string[]
  unlocks: UnlockView[]
  access: Access
  available: { key: string, name: string }[]
}

const unlocked = ref<string[]>([])
const unlockedQuery = computed(() => unlocked.value.join(','))

const { data: tree } = await useFetch<{ nodes: TechNode[] }>('/api/campaign-modes/tech-tree')
// the starting access without any tech, to tell default unlocks from gained ones
const { data: base } = await useFetch<AvailableResponse>('/api/campaign-modes/tech-tree/available')
const { data: current } = await useFetch<AvailableResponse>('/api/campaign-modes/tech-tree/available', {
  query: { unlocked: unlockedQuery },
  watch: [unlockedQuery],
})

// the hardware catalogue, to show every module and not only the unlocked ones
const { data: catalogue } = await useFetch<{ name: string }[]>('/api/hardware')

const basic = computed(() => tree.value?.nodes.filter(n => n.tier === 'basic') ?? [])
const advanced = computed(() => tree.value?.nodes.filter(n => n.tier === 'advanced') ?? [])

const isUnlocked = (key: string) => unlocked.value.includes(key)

// an advanced tech can only be chosen when it is connected to an unlocked tech
const reachable = (node: TechNode) => node.tier === 'basic' || node.neighbours.some(isUnlocked)
// unlocked techs stay clickable so they can be turned off again
const locked = (node: TechNode) => !isUnlocked(node.key) && !reachable(node)

function toggle(key: string) {
  const i = unlocked.value.indexOf(key)
  if (i >= 0) unlocked.value.splice(i, 1)
  else unlocked.value.push(key)
}

const unlockAll = () => { unlocked.value = tree.value?.nodes.map(n => n.key) ?? [] }
const reset = () => { unlocked.value = [] }

// ---- grouped access -----------------------------------------------------------------------------

interface Item { label: string, gained: boolean, disabled?: boolean }

const has = (list: (string | number)[] | undefined, v: string | number) => !!list?.includes(v)

// every possible weapon value, the ones a force cannot use (yet) are shown disabled
const allRanges = ['Short', 'Long', 'Arc', 'Brawl']
const allTypes = ['Burst', 'Piercing', 'Guided', 'Multi']
const allSubtypes = ['Expendable', 'Thermal', 'Jolt', 'Radiation']
const allPowers = [1, 2, 3, 4]
const allMacClasses = [1, 2, 3]

function allItems(all: string[], values: string[], baseValues: string[]): Item[] {
  return all.map(v => ({
    label: v,
    gained: values.includes(v) && !baseValues.includes(v),
    disabled: !values.includes(v),
  }))
}

// numbered badges up to the highest unlocked value (power 1-4, MAC class 1-3)
function numberItems(all: number[], max: number, baseMax: number): Item[] {
  return all.map(n => ({ label: String(n), gained: n <= max && n > baseMax, disabled: n > max }))
}

function items(values: string[], baseValues: string[] | undefined, label = (v: string) => v): Item[] {
  return values.map(v => ({ label: label(v), gained: !has(baseValues, v) }))
}

const groups = computed(() => {
  const a = current.value?.access
  const b = base.value?.access
  if (!a || !b) return []

  // every module of the catalogue (plus unlocked ones that are not in it), the locked ones disabled
  const names = new Set([...(catalogue.value ?? []).map(h => h.name), ...a.hardware.map(h => h.name)])
  const hardware: Item[] = [...names]
      .sort((x, y) => x.localeCompare(y))
      .map(name => {
        const now = a.hardware.find(h => h.name === name)
        if (!now) return { label: name, gained: false, disabled: true }
        const before = b.hardware.find(h => h.name === name)
        const restriction = now.usableBy ? ` (${now.usableBy.join(' + ')} only)` : ''
        const gained = !before || (before.usableBy !== null && (now.usableBy === null || now.usableBy.length > before.usableBy.length))
        return { label: `${name}${restriction}`, gained, disabled: false }
      })
  const unlockedCount = hardware.filter(h => !h.disabled).length

  return [
    {
      title: 'Units',
      rows: [
        { label: 'MAC class', items: numberItems(allMacClasses, a.maxMacClass, b.maxMacClass) },
        { label: 'Auxiliary', items: items(a.units, b.units, v => `${v} AUs`) },
      ],
    },
    {
      // one line per weapon property
      title: 'Weapons',
      rows: [
        { label: 'Range', items: allItems(allRanges, a.weapons.ranges, b.weapons.ranges) },
        { label: 'Type', items: allItems(allTypes, a.weapons.types, b.weapons.types) },
        { label: 'Subtype', items: allItems(allSubtypes, a.weapons.subtypes, b.weapons.subtypes) },
        { label: 'Power', items: numberItems(allPowers, a.weapons.maxPower, b.weapons.maxPower) },
      ],
    },
    { title: `Hardware (${unlockedCount} of ${hardware.length})`, rows: [{ label: '', items: hardware }] },
    { title: 'Rules', rows: [{ label: '', items: items(a.rules, b.rules) }] },
  ].map(g => ({ ...g, rows: g.rows.filter(r => r.items.length) })).filter(g => g.rows.length)
})
</script>

<template>
  <div class="pb-12">

    <div class="mb-6">
      <h1 class="text-3xl font-bold">Tech Tree Mode (see pg. 62)</h1>
      <p class="text-sm text-muted">
        Toggle techs and see everything the force has access to: starting access plus what the techs unlock.
        Advanced techs are disabled until they are connected to an unlocked tech. Test page for the tech tree endpoints.
      </p>
    </div>

    <div class="flex flex-wrap gap-2 mb-8">
      <UButton color="info" variant="outline" icon="i-material-symbols-light-select-all" class="cursor-pointer" @click="unlockAll">
        Unlock all
      </UButton>
      <UButton color="error" variant="outline" icon="i-material-symbols-light-restart-alt" class="cursor-pointer" @click="reset">
        Reset
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

      <!-- techs -->
      <div class="lg:col-span-3">
        <template v-for="section in [{ title: 'Basic tech', list: basic }, { title: 'Advanced tech', list: advanced }]" :key="section.title">
          <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">{{ section.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <!-- a div, the switch renders a button of its own and buttons must not be nested -->
            <div
                v-for="node in section.list"
                :key="node.key"
                role="button"
                :tabindex="locked(node) ? -1 : 0"
                :aria-disabled="locked(node)"
                class="text-left rounded-xl border p-3 transition-colors"
                :class="[
                  isUnlocked(node.key) ? 'border-success bg-success/10' : 'border-default bg-elevated/40',
                  locked(node) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-elevated',
                ]"
                @click="!locked(node) && toggle(node.key)"
                @keydown.enter.prevent="!locked(node) && toggle(node.key)"
                @keydown.space.prevent="!locked(node) && toggle(node.key)"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-bold">{{ node.name }}</span>
                <USwitch :model-value="isUnlocked(node.key)" size="sm" class="pointer-events-none" tabindex="-1" />
              </div>
              <div class="text-sm text-muted mt-1">{{ node.unlocks.map(u => u.label).join(', ') }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- resulting access -->
      <div class="lg:col-span-2 lg:sticky lg:top-4 rounded-xl border border-default bg-elevated/40 p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-bold">Access</h2>
          <div class="flex gap-1.5">
            <UBadge color="neutral" variant="subtle" size="sm">Default</UBadge>
            <UBadge color="info" variant="subtle" size="sm">Unlocked</UBadge>
          </div>
        </div>

        <div v-for="group in groups" :key="group.title" class="mb-4 last:mb-0">
          <div class="text-[11px] uppercase tracking-wider text-muted mb-1.5">{{ group.title }}</div>
          <div class="flex flex-col gap-1.5">
            <div v-for="row in group.rows" :key="row.label" class="flex items-baseline gap-2">
              <span v-if="row.label" class="w-16 shrink-0 text-xs text-muted">{{ row.label }}</span>
              <div class="flex flex-wrap gap-1.5">
                <UBadge
                    v-for="item in row.items"
                    :key="item.label"
                    :color="item.gained ? 'info' : 'neutral'"
                    :variant="item.gained ? 'subtle' : item.disabled ? 'outline' : 'subtle'"
                    :class="{ 'opacity-40 line-through': item.disabled }"
                >
                  {{ item.label }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
