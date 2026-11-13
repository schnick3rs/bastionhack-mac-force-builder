<script setup lang="ts">
import type {MAC} from "~~/types/unit";
import {buildWeaponDisplayString} from "#shared/utils/weapons";

// demo page, only available when running locally
if (!useIsLocalhost()) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({ title: 'Scrap Mode Demo | MACtory' })

interface RolledModule {
  type: 'Weapon' | 'Hardware'
  label: string
}

interface ChassisRoll {
  id: number
  roll: number
  chassis: string
  mac: MAC
}

interface ModuleRoll {
  id: number
  category: string
  choice: boolean
  options: RolledModule[]
  picked: number
}

const chassis = ref<ChassisRoll[]>([])
const modules = ref<ModuleRoll[]>([])
const busy = ref(false)
let nextId = 1

async function rollChassis() {
  const res = await $fetch<{ roll: number, chassis: string, mac: MAC }>('/api/campaign-modes/scrap-mode/roll-mac')
  chassis.value.push({ id: nextId++, roll: res.roll, chassis: res.chassis, mac: res.mac })
}

async function rollModule() {
  const res = await $fetch<{ category: string, choice: boolean, options: RolledModule[] }>('/api/campaign-modes/scrap-mode/roll-module')
  modules.value.push({
    id: nextId++,
    category: res.category,
    choice: res.choice,
    options: res.options,
    picked: 0,
  })
}

async function run(action: () => Promise<void>) {
  busy.value = true
  try { await action() } finally { busy.value = false }
}

// the starting set: three chassis and six modules
const rollSet = () => run(async () => {
  chassis.value = []
  modules.value = []
  for (let i = 0; i < 3; i++) await rollChassis()
  for (let i = 0; i < 6; i++) await rollModule()
})

// campaign: before each battle a force gains one chassis and three modules
const rollAdditionalSet = () => run(async () => {
  await rollChassis()
  for (let i = 0; i < 3; i++) await rollModule()
})

const reset = () => {
  chassis.value = []
  modules.value = []
}

function moduleLines(mac: MAC): string[] {
  return mac.modules
      .filter(m => m.type !== 'Empty')
      .map(m => m.type === 'Weapon' ? buildWeaponDisplayString(m.profile) : m.profile.name)
}

const emptySlots = (mac: MAC) => mac.modules.filter(m => m.type === 'Empty').length
const feats = (mac: MAC) => [...(mac.perks ?? []), ...(mac.flaws ?? [])]

const categoryLabels: Record<string, string> = {
  'weapon': 'Weapon',
  'weapon-subtype': 'Weapon (subtype)',
  'civilian-hardware': 'Civilian hardware',
  'military-hardware': 'Military hardware',
}
</script>

<template>
  <div class="pb-12">

    <div class="mb-6">
      <h1 class="text-3xl font-bold">Scrap Mode</h1>
      <p class="text-sm text-muted">
        Players build their forces from a limited heap of components: three chassis and six modules.
        Slots left empty count as frame modules. Test page for the roll endpoints.
      </p>
    </div>

    <div class="flex flex-wrap gap-2 mb-8">
      <UButton size="lg" color="info" icon="i-material-symbols-light-casino-outline" :loading="busy" class="cursor-pointer" @click="rollSet">
        Roll set (3 chassis + 6 modules)
      </UButton>
      <UButton size="lg" color="info" variant="outline" icon="i-material-symbols-light-playlist-add" :disabled="busy" class="cursor-pointer" @click="rollAdditionalSet">
        Roll additional set (1 chassis + 3 modules)
      </UButton>
      <UButton size="lg" color="info" variant="outline" icon="i-material-symbols-light-add" :disabled="busy" class="cursor-pointer" @click="run(rollChassis)">
        Chassis
      </UButton>
      <UButton size="lg" color="info" variant="outline" icon="i-material-symbols-light-add" :disabled="busy" class="cursor-pointer" @click="run(rollModule)">
        Module
      </UButton>
      <UButton size="lg" color="error" variant="outline" icon="i-material-symbols-light-restart-alt" class="cursor-pointer" @click="reset">
        Reset
      </UButton>
    </div>

    <!-- chassis -->
    <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">Chassis ({{ chassis.length }})</h2>
    <p v-if="!chassis.length" class="text-sm text-muted mb-8">Nothing rolled yet.</p>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8 items-start">
      <div v-for="(c, i) in chassis" :key="c.id" class="rounded-xl border border-default bg-elevated/40 p-4">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="text-xl font-bold">{{ c.chassis }}</div>
            <div class="flex gap-1.5 mt-1">
              <UBadge color="neutral" variant="subtle" size="sm">Class {{ c.mac.class }} MAC</UBadge>
              <UBadge color="neutral" variant="outline" size="sm">Rolled {{ c.roll }}</UBadge>
            </div>
          </div>
          <UButton icon="i-material-symbols-light-cancel-outline" color="error" variant="ghost" size="sm" class="cursor-pointer" @click="chassis.splice(i, 1)" />
        </div>

        <ul class="mt-3 flex flex-col gap-1">
          <li v-for="line in moduleLines(c.mac)" :key="line" class="font-semibold">{{ line }}</li>
          <li v-if="!moduleLines(c.mac).length" class="text-sm text-muted">No pre-installed modules</li>
        </ul>
        <p v-if="emptySlots(c.mac)" class="text-xs text-muted mt-2">{{ emptySlots(c.mac) }} empty slots (frame modules)</p>

        <div v-if="feats(c.mac).length" class="flex flex-wrap gap-1.5 mt-3">
          <div v-for="f in feats(c.mac)" :key="f.name" class="w-full">
            <UBadge :color="f.type === 'Perk' ? 'success' : 'error'" variant="subtle">{{ f.type }}: {{ f.name }}</UBadge>
            <div v-if="f.effect" class="text-xs text-muted mt-1">{{ f.effect }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- modules -->
    <h2 class="text-[11px] uppercase tracking-wider text-muted mb-2">Modules ({{ modules.length }})</h2>
    <p v-if="!modules.length" class="text-sm text-muted">Nothing rolled yet.</p>
    <ul v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
      <li v-for="(m, i) in modules" :key="m.id" class="rounded-xl border border-default bg-elevated/40 p-3 flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="text-[11px] uppercase tracking-wider text-muted">{{ categoryLabels[m.category] ?? m.category }}</div>

          <div v-if="!m.choice" class="font-semibold">{{ m.options[0]!.label }}</div>

          <template v-else>
            <UFieldGroup size="sm" class="mt-1">
              <UButton
                  v-for="(o, j) in m.options"
                  :key="o.label"
                  color="info"
                  :variant="m.picked === j ? 'solid' : 'outline'"
                  class="cursor-pointer"
                  @click="m.picked = j"
              >
                {{ o.label }}
              </UButton>
            </UFieldGroup>
            <div class="text-xs text-muted mt-1">Either or, you choose</div>
          </template>
        </div>
        <UButton icon="i-material-symbols-light-cancel-outline" color="error" variant="ghost" size="sm" class="cursor-pointer" @click="modules.splice(i, 1)" />
      </li>
    </ul>

  </div>
</template>
