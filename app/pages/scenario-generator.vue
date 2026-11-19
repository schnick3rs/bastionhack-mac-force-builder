<script setup lang="ts">
import type {DeploymentStep, ScenarioObjective, ScenarioTwist, Side} from "~~/server/data/scenarioRepository";

useHead({title: 'Scenario Generator | MACtory'})

interface RolledDeployment { roll: number, dice: number[], steps: DeploymentStep[] }
interface RolledObjective extends ScenarioObjective { dice: number[] }
interface Scenario {
  red: { deployment: RolledDeployment, objective: RolledObjective }
  blue: { deployment: RolledDeployment, objective: RolledObjective }
  twist: ScenarioTwist & { dice: number[] }
}

// the rolls live in the URL, so a scenario can be shared and survives a reload
const route = useRoute()
const router = useRouter()
const rollKeys = ['redDeployment', 'blueDeployment', 'redObjective', 'blueObjective', 'twist'] as const
const query = computed(() => Object.fromEntries(rollKeys.filter(k => route.query[k]).map(k => [k, route.query[k]])))

const {data: scenario} = await useFetch<Scenario>('/api/scenario-generator/roll', {query})

function rollsOf(s: Scenario) {
  return {
    redDeployment: s.red.deployment.roll,
    blueDeployment: s.blue.deployment.roll,
    redObjective: s.red.objective.roll,
    blueObjective: s.blue.objective.roll,
    twist: s.twist.roll,
  }
}

const busy = ref(false)
async function shuffle() {
  busy.value = true
  try {
    const fresh = await $fetch<Scenario>('/api/scenario-generator/roll')
    await router.replace({query: rollsOf(fresh)})
  } finally {
    busy.value = false
  }
}

// pin the first random result to the URL
onMounted(() => {
  if (scenario.value && !route.query.twist) router.replace({query: rollsOf(scenario.value)})
})

const sides: Side[] = ['red', 'blue']
const sideStyle = {
  red: {text: 'text-red-500', solid: 'bg-red-500', light: 'bg-red-300', ring: 'border-red-500', stroke: '#ef4444'},
  blue: {text: 'text-blue-500', solid: 'bg-blue-500', light: 'bg-blue-300', ring: 'border-blue-500', stroke: '#3b82f6'},
} as const

// point 1-9 -> position on the board in percent (corners, edge centres, centre)
const pos = (point: number) => ({x: ((point - 1) % 3) * 50, y: Math.floor((point - 1) / 3) * 50})

// labels sit towards the inside of the board, the circles themselves are clipped by its edge
const inward = (v: number) => v === 0 ? 8 : v === 100 ? -8 : 0

interface Token { key: string, side: Side, division: string, round: number, point: number, x: number, y: number, lx: number, ly: number }

const tokens = computed<Token[]>(() => {
  if (!scenario.value) return []
  return sides.flatMap(side => scenario.value![side].deployment.steps.flatMap(step =>
      step.divisions.map(({division, point}) => {
        const {x, y} = pos(point)
        return {key: `${side}${division}`, side, division, round: step.round, point, x, y, lx: x + inward(x), ly: y + inward(y)}
      })))
})

const markers = computed(() => sides.flatMap(side => {
  const m = scenario.value?.[side].objective.marker
  return {side, points: (m?.points ?? []).map(pos), line: m?.line ? m.line.map(pos) : null}
}))

const pointsUsed = computed(() => new Set(tokens.value.map(t => t.point)))

const describe = (steps: DeploymentStep[]) =>
    steps.map(s => `Round ${s.round}: ` + s.divisions.map(d => `Div ${d.division} → point ${d.point}`).join(', '))
</script>

<template>
  <div class="pb-12" v-if="scenario">

    <div class="flex flex-wrap items-end gap-3 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Scenario Generator</h1>
        <p class="text-sm text-muted">Deployment, objectives and twist (pg. 20-21). Assumes a 48" board.</p>
      </div>
      <UButton class="ml-auto cursor-pointer" icon="i-game-icons-rolling-dices" :loading="busy" @click="shuffle">
        Shuffle all
      </UButton>
    </div>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,28rem)_1fr]">

      <!-- Board -->
      <div>
        <div class="relative aspect-square w-full overflow-hidden rounded bg-slate-200">

          <!-- 3x3 grid with a watermark of each point's number -->
          <div class="absolute inset-0 grid grid-cols-3 grid-rows-3">
            <div v-for="n in 9" :key="n"
                 class="flex items-center justify-center border border-white text-2xl font-bold text-slate-600 select-none">
              <template v-if="!pointsUsed.has(n)">{{ n }}</template>
            </div>
          </div>

          <!-- lines of line objectives -->
          <svg class="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <template v-for="m in markers" :key="m.side">
              <line v-if="m.line"
                    :x1="m.line[0]!.x" :y1="m.line[0]!.y" :x2="m.line[1]!.x" :y2="m.line[1]!.y"
                    :stroke="sideStyle[m.side].stroke" stroke-width="2" stroke-dasharray="4 3"
                    vector-effect="non-scaling-stroke"/>
            </template>
          </svg>

          <!-- objective points, 3" radius on a 48" board -->
          <template v-for="m in markers" :key="m.side">
            <div v-for="p in m.points" :key="`${m.side}${p.x}${p.y}`"
                 class="absolute aspect-square w-[12.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
                 :class="sideStyle[m.side].ring"
                 :style="{left: p.x + '%', top: p.y + '%'}"/>
          </template>

          <!-- deployment: circle + label per division -->
          <div v-for="t in tokens" :key="`c${t.key}`"
               class="absolute aspect-square w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
               :class="t.round === 1 ? sideStyle[t.side].solid : sideStyle[t.side].light"
               :style="{left: t.x + '%', top: t.y + '%'}"/>
          <div v-for="t in tokens" :key="`l${t.key}`"
               class="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-none"
               :class="t.round === 1 ? 'text-white drop-shadow' : 'text-slate-900'"
               :style="{left: t.lx + '%', top: t.ly + '%'}">
            <div class="text-xl font-bold">{{ t.division }}</div>
            <div class="text-[10px] font-semibold">R{{ t.round }}</div>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span class="flex items-center gap-1"><span class="inline-block size-3 rounded-full bg-slate-500"/> Round 1</span>
          <span class="flex items-center gap-1"><span class="inline-block size-3 rounded-full bg-slate-300"/> Round 2</span>
          <span class="flex items-center gap-1"><span class="inline-block size-3 rounded-full border-2 border-dashed border-slate-500"/> Objective point (3")</span>
          <span class="flex items-center gap-1"><span class="inline-block w-4 border-t-2 border-dashed border-slate-500"/> Objective line</span>
        </div>
      </div>

      <!-- Text -->
      <div class="space-y-6">

        <section v-for="side in sides" :key="side">
          <h2 class="text-xl font-bold capitalize" :class="sideStyle[side].text">{{ side }}</h2>

          <p class="mt-2">
            <strong>Objective #{{ scenario[side].objective.roll }}:</strong>
            {{ scenario[side].objective.text }}
          </p>

          <p class="mt-2 text-sm">
            <strong>Deployment #{{ scenario[side].deployment.roll }}</strong>
          </p>
          <ul class="text-sm text-muted">
            <li v-for="line in describe(scenario[side].deployment.steps)" :key="line">{{ line }}</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold">Twist</h2>
          <p class="mt-2">
            <strong>#{{ scenario.twist.roll }} {{ scenario.twist.name }}:</strong>
            {{ scenario.twist.text }}
          </p>
        </section>

        <p class="text-sm text-muted">
          At the end of each round from round 3, check whether an objective has been achieved. If both are achieved
          on the same round, or round 5 ends, the player who sustained the fewest casualties (points cost) wins.
          Units deployed to point 5 are placed within 3" of it.
        </p>
      </div>
    </div>
  </div>
</template>
