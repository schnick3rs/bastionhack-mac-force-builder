<script setup lang="ts">
import '~/assets/css/cards.css'
import '~/assets/css/initiative.css'
import {useForcesStore} from "~/stores/forces";
import {buildInitiativeCards, chunkSheets} from "#shared/utils/initiative";
import type {Suit} from "#shared/utils/cards";
import {suitSymbol} from "#shared/utils/cards";

// card back images, add more by dropping a file into /public/img and listing it here
const backImages = [
  {label: 'No back side', value: 'none'},
  {label: 'MACtory logo', value: '/mactory-square-800x800.jpg'},
  {label: 'Custom URL…', value: 'custom'},
]

const forcesStore = useForcesStore();
const route = useRoute();
const force = forcesStore.forceById(route.params.forceId as string)
if (!force) {
  throw new Error('Force not found')
}

useHead(() => ({
  title: `${force.name} | Initiative deck | MACtory`,
  style: [{ key: 'print-page', innerHTML: `@page { size: A4 landscape; margin: 0; }` }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600&display=swap' },
  ],
}))

const cards = computed(() => buildInitiativeCards(force))
// without a back the fronts fill the sheet (8 per sheet instead of 4)
const showBack = computed(() => backChoice.value !== 'none')
const sheets = computed(() => chunkSheets(cards.value, showBack.value ? 4 : 8))

// suit of the border on the fronts, remembered in the browser
const stored = localStorage.getItem('initiativeSuit')
const suit = ref<Suit>((['clubs', 'spades', 'hearts', 'diamonds'] as const).find(x => x === stored) ?? 'spades')
watch(suit, (value) => localStorage.setItem('initiativeSuit', value))
const suitColor = computed(() => suit.value === 'hearts' || suit.value === 'diamonds' ? '#c0262d' : '#1a1a1a')

// card back, remembered in the browser
const backChoice = ref(localStorage.getItem('initiativeBack') ?? backImages[0]!.value)
const backUrl = ref(localStorage.getItem('initiativeBackUrl') ?? '')
if (!backImages.some(i => i.value === backChoice.value)) backChoice.value = backImages[0]!.value
watch(backChoice, (value) => localStorage.setItem('initiativeBack', value))
watch(backUrl, (value) => localStorage.setItem('initiativeBackUrl', value))
const backImage = computed(() => {
  const src = backChoice.value === 'custom' ? backUrl.value.trim() : backChoice.value
  return src ? `url("${src.replace(/["\\\n]/g, encodeURIComponent)}")` : 'none'
})

const handlePrint = () => window.print()
const bandSize = (name: string) => name.length > 22 ? 's' : name.length > 13 ? 'm' : 'l'
</script>

<template>
  <div class="cards-root">

    <div class="print:hidden flex items-center justify-between gap-4 p-4 flex-wrap">
      <UButton size="xl" variant="subtle" color="info" class="font-bold" icon="i-material-symbols-light-chevron-left-rounded" :to="`/builder/${force.id}/view`">
        Back
      </UButton>
      <UFieldGroup size="xl">
        <UButton color="neutral" :variant="suit === 'clubs' ? 'solid' : 'outline'" icon="i-game-icons-clubs" @click="suit = 'clubs'" />
        <UButton color="neutral" :variant="suit === 'spades' ? 'solid' : 'outline'" icon="i-game-icons-spades" @click="suit = 'spades'" />
        <UButton color="error" :variant="suit === 'hearts' ? 'solid' : 'outline'" icon="i-game-icons-hearts" @click="suit = 'hearts'" />
        <UButton color="error" :variant="suit === 'diamonds' ? 'solid' : 'outline'" icon="i-game-icons-diamonds" @click="suit = 'diamonds'" />
      </UFieldGroup>
      <div class="flex items-center gap-2">
        <USelect v-model="backChoice" :items="backImages" size="xl" class="w-44" />
        <UInput v-if="backChoice === 'custom'" v-model="backUrl" size="xl" placeholder="https://… image URL" class="w-64" />
      </div>
      <UButton size="xl" variant="outline" color="info" class="font-bold cursor-pointer" icon="i-material-symbols-light-print" @click="handlePrint">
        Print
      </UButton>
    </div>

    <div class="sheets flex flex-col gap-6 p-4 overflow-x-auto print:overflow-visible print:p-0 print:gap-0 items-start">
      <div v-for="(sheet, n) in sheets" :key="n" class="sheet shadow-lg">
        <!-- every card is front | back, cut it out and fold it in the middle -->
        <template v-for="(card, i) in sheet" :key="i">
          <div class="slot">
            <div v-if="card" class="init-card init-front">
              <div class="init-pip tl" :style="{ color: suitColor }">{{ suitSymbol[suit] }}</div>
              <div class="init-pip br" :style="{ color: suitColor }">{{ suitSymbol[suit] }}</div>
              <div class="init-head">
                <span class="init-head-name" :class="bandSize(card.name)">{{ card.name }}</span>
                <span class="init-head-sub">{{ card.header }}</span>
              </div>
              <div class="init-icon" :class="{ small: card.rule }"><UIcon :name="card.icon" /></div>
              <div v-if="card.rule" class="init-rule" :class="{ long: card.rule.length > 200 }">{{ card.rule }}</div>
              <div class="init-foot">{{ card.footer }}</div>
            </div>
            <div v-else class="init-card empty"></div>
          </div>
          <div v-if="showBack" class="slot">
            <div v-if="card" class="init-card init-back" :style="{ backgroundImage: backImage }">
              <div v-if="backChoice === '/mactory-square-800x800.jpg'" class="init-back-foot">https://mactory.ravenbeak.dev/</div>
            </div>
            <div v-else class="init-card empty"></div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
