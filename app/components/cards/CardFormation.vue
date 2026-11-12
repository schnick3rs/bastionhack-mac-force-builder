<script setup lang="ts">
import type {FormationCard} from "#shared/utils/cards";
defineProps<{ card: FormationCard }>()
</script>

<template>
  <div class="card" :class="card.big ? 'a7' : 'a8'">
    <CardsCardHeader :activation="card.activation" :title="card.title" :sub="card.sub" :division="card.division" />

    <div class="c-losses">
      <span class="c-label">Losses</span>
      <span v-for="i in card.max" :key="i" class="c-box" :class="{ 'c-box-dashed': i > card.solid }"></span>
    </div>
    <div class="c-helper" :class="{ 'c-helper-small': card.helper.length > 20 }">{{ card.helper }}</div>

    <div class="c-weapons">
      <div v-for="(w, i) in card.weapons" :key="i" class="c-wname">
        {{ w.name }} <CardsCardUsed v-if="w.used" />
      </div>
    </div>

    <div class="c-hw">
      <div v-for="h in card.hardware" :key="h.name" class="c-hw-item"><b>{{ h.name }}</b><template v-if="h.rule">: {{ h.rule }}</template></div>
    </div>

    <div v-if="card.auSlots" class="c-au-row">
      <div v-for="i in card.auSlots" :key="i" class="c-au">AU {{ i }}</div>
    </div>

    <CardsCardFactionBox v-if="card.faction" :box="card.faction" class="c-push" />
  </div>
</template>
