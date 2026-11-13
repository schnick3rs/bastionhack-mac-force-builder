<script setup lang="ts">
import type {PilotCard} from "#shared/utils/cards";
import {Avatar, Style} from "@dicebear/core";
import definition from "@dicebear/styles/lorelei.json";

const props = defineProps<{ card: PilotCard }>()

// placeholder portrait: a generated avatar (DiceBear, Lorelei style by Lisa Wischofsky, CC0), created locally
const style = new Style(definition as any)

// monochrome look in warm ink on paper, the seed (pilot name) picks the face
const ink = ['2f2a24']
const avatarOptions = {
  scale: 1.15,
  skinColor: ['fffdf9'],
  hairColor: ink,
  eyebrowsColor: ink,
  eyesColor: ink,
  noseColor: ink,
  mouthColor: ink,
  frecklesColor: ink,
  glassesColor: ink,
  earringsColor: ink,
  hairAccessoriesColor: ink,
  outlineColor: ink,
  mouthVariant: [
    'happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy08', 'happy10', 'happy11',
    'happy13', 'happy14', 'happy17', 'happy18',
    'sad01', 'sad02', 'sad03', 'sad04', 'sad05', 'sad06', 'sad07', 'sad09',
  ],
  hairAccessoriesVariant: [],
}

const portrait = computed(() => new Avatar(style, { ...avatarOptions, seed: props.card.seed } as any).toDataUri())

// overflow policy: tighter spacing when the text does not fit the half height card
const root = ref<HTMLElement>()
const tight = ref(false)

async function fit() {
  tight.value = false
  await nextTick()
  if (root.value && root.value.scrollHeight > root.value.clientHeight) tight.value = true
}

onMounted(() => {
  fit()
  document.fonts?.ready.then(fit)
})
watch(() => props.card, fit, { deep: true })
</script>

<template>
  <div ref="root" class="card half pilot" :class="{ tight }">
    <div class="c-portrait">
      <img :src="portrait" alt="" />
    </div>
    <div class="c-pilot-body">
      <div class="c-pilot-name">“{{ card.name }}”</div>
      <div class="c-pilot-rule"></div>
      <div class="c-pilot-text"><b>{{ card.trick }}:</b> {{ card.text }}</div>
    </div>
  </div>
</template>
