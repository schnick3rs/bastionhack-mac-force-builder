<script setup lang="ts">
import type {MacCard, MacRow} from "#shared/utils/cards";
const props = defineProps<{ card: MacCard }>()

// overflow policy: fall back to tighter spacing (compact, then tight) when the content does not fit the card
const root = ref<HTMLElement>()
const level = ref(0)

async function fit() {
  level.value = 0
  await nextTick()
  while (root.value && root.value.scrollHeight > root.value.clientHeight && level.value < 2) {
    level.value++
    await nextTick()
  }
}

onMounted(() => {
  fit()
  // web fonts change the text metrics once they have loaded
  document.fonts?.ready.then(fit)
})
watch(() => props.card, fit, { deep: true })

function bracket(row: MacRow) {
  return row.slots.length > 1
}
</script>

<template>
  <div ref="root" class="card a7" :class="{ compact: level >= 1, tight: level >= 2 }">
    <CardsCardHeader :activation="card.activation" :title="card.name" :sub="`Class ${card.cls} MAC · ${card.pts} pts`" :division="card.division" />

    <div class="c-status">
      <span class="c-label">Internal damage</span>
      <span v-for="i in card.internalBoxes" :key="i" class="c-box"></span>
    </div>

    <div class="c-rows">
      <!-- slot 0 (faction special) with its rule beneath it -->
      <template v-if="card.zeroRow">
        <div class="c-row">
          <div class="c-slots"><div class="c-slot-line"><span class="c-slot">0</span><span class="c-dmg"><i></i><i></i></span></div></div>
          <div class="c-main">
            <div class="c-name">{{ card.zeroRow.name }}</div>
            <div v-if="card.zeroRow.rule" class="c-rule">{{ card.zeroRow.rule }}</div>
          </div>
        </div>
        <CardsCardFactionBox v-if="card.zeroRule" :box="card.zeroRule" />
        <hr class="c-hr">
      </template>

      <template v-for="(row, i) in card.rows" :key="i">
        <div class="c-row" :class="{ 'c-row-empty': row.empty }">
          <div class="c-slots" :class="{ 'c-bracket': bracket(row) }">
            <div v-for="s in row.slots" :key="s" class="c-slot-line">
              <span class="c-slot">{{ s }}</span><span class="c-dmg"><i></i><i></i></span>
            </div>
          </div>
          <div class="c-main">
            <div class="c-name-line">
              <span class="c-name">{{ row.name }}</span>
              <CardsCardUsed v-if="row.used" />
            </div>
            <div v-if="row.rule && !row.full" class="c-rule">{{ row.rule }}</div>
          </div>
        </div>
        <div v-if="row.rule && row.full" class="c-rule c-rule-full">{{ row.rule }}</div>
      </template>
    </div>

    <!-- perks / flaws and the faction rule, aligned to the bottom -->
    <div v-if="card.feats.length || card.faction" class="c-bottom">
      <div v-if="card.feats.length" class="c-faction">
        <div v-for="f in card.feats" :key="f.name"><b>{{ f.name }}</b><template v-if="f.text">: {{ f.text }}</template></div>
      </div>
      <CardsCardFactionBox v-if="card.faction" :box="card.faction" />
    </div>
  </div>
</template>
