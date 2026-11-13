<script setup lang="ts">
import '~/assets/css/cards.css'
import {useForcesStore} from "~/stores/forces";
import type {Suit} from "#shared/utils/cards";
import {buildSheets} from "#shared/utils/cards";


const forcesStore = useForcesStore();
const route = useRoute();
const forceId = route.params.forceId as string;
const force = forcesStore.forceById(forceId)
if (!force) {
  throw new Error('Force not found')
}

useHead({
  title: `${force.name} | Cards | MACtory`,
  // lives in the head so it is removed again when leaving this page
  style: [{ key: 'print-page', innerHTML: '@page { size: A4 landscape; margin: 0; }' }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600&display=swap' },
  ],
})

function handlePrint() {
  window.print()
}

const suit = ref<Suit>('spades')
const sheets = computed(() => buildSheets(force, suit.value))
</script>

<template>
  <div class="cards-root">

    <!-- screen only toolbar -->
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

      <div class="flex items-center gap-3">
        <span class="text-sm text-muted hidden md:inline">A4 landscape, no margins, background graphics on</span>
        <UButton size="xl" variant="outline" color="info" class="font-bold cursor-pointer" icon="i-material-symbols-light-print" @click="handlePrint">
          Print
        </UButton>
      </div>
    </div>

    <div class="sheets flex flex-col gap-6 p-4 overflow-x-auto print:overflow-visible print:p-0 print:gap-0 items-start">
      <div v-for="(sheet, n) in sheets" :key="n" class="sheet shadow-lg">
        <template v-for="(slot, i) in sheet" :key="i">
          <div v-if="slot.type === 'a7'" class="slot">
            <CardsCardMac v-if="slot.card.kind === 'mac'" :card="slot.card" />
            <CardsCardFormation v-else :card="slot.card" />
          </div>
          <div v-else-if="slot.type === 'a8'" class="slot">
            <template v-for="(c, j) in slot.cards" :key="j">
              <CardsCardModule v-if="c && c.kind === 'module'" :card="c" />
              <CardsCardFormation v-else-if="c && c.kind === 'formation'" :card="c" />
              <CardsCardAsset v-else-if="c && c.kind === 'asset'" :card="c" />
              <div v-else class="card a8 empty"></div>
            </template>
          </div>
          <div v-else class="slot"><div class="card a7 empty"></div></div>
        </template>
      </div>
    </div>

  </div>
</template>
