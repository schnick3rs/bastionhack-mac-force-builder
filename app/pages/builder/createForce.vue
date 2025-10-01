<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {useForcesStore} from "~/stores/forces";
import type {Faction} from "~~/types/unit";

import { uniqueUsernameGenerator as gen, adjectives, nouns } from 'unique-username-generator';

function randomForceName() {
  return `The ${gen({ dictionaries: [adjectives], style: 'capital'})} ${gen({ dictionaries: [nouns], style: 'capital'})} Force`;
}

function randomFactionSymbol(abstract_id: string = getRandomPadded()) {
  return `i-game-icons-abstract-${abstract_id}`
}

function getRandomPadded() {
  const num = Math.floor(Math.random() * 120) + 1; // 1 - 100
  return String(num).padStart(3, '0'); // Pads with leading zeros
}

const state =  reactive({
  symbol: randomFactionSymbol(),
  name: randomForceName(),
  description: '',
  pointLimit: 50,
  faction: '',
})

const faction = ref('')

const symbol = computed(() => {
  if (faction.value) {
    return `/factions/${faction.value}-symbol.png`
  }
  return randomFactionSymbol();
})

const { data: factions, status } = await useFetch('/api/factions', {
  key: 'typicode-users',
  transform: (data: Faction[]) => {
    return data?.map(faction => ({
      label: faction.name,
      value: faction.key,
      sparks: faction.sparks,
      avatar: { src: `/factions/${faction.key}-symbol.png` }
    }))
  },
  lazy: true
})

const forces = useForcesStore()
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'A new force has ben created.', color: 'success' })

  let force = event.data;

  const createdForce = await forces.createNewForceList({...force, symbol, factionKey: faction.value})

  console.log('force', createdForce)
  navigateTo(`/builder/${createdForce.id}/entries`)
}

const pointLimitSelection = ref(50);

function setPointLimit(pointLimit: number) {
  pointLimitSelection.value = pointLimit;
  state.pointLimit = pointLimit;
}


</script>

<template>
  <div class="flex justify-center">

    <UForm :state="state" class="space-y-4 mt-8" @submit="onSubmit">

      <div class="text-center pb-4">
        <UAvatar v-if="faction" :ui="{ 'root': 'size-24 text-6xl' }" :src="symbol"></UAvatar>
        <UAvatar v-else :ui="{ 'root': 'size-24 text-6xl' }" :icon="symbol" @click="state.symbol = randomFactionSymbol()"></UAvatar>
      </div>

      <div class="flex flex-col gap-8 w-92">

        <UInput v-model="state.name" placeholder="" :ui="{ base: 'peer' }" size="xl">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Name</span>
          </label>
          <template #trailing>
            <UTooltip text="Generate random name" :content="{ side: 'right' }">
              <UButton
                  class="pointer-events"
                  color="neutral"
                  variant="link"
                  icon="i-material-symbols-light-autorenew"
                  aria-label="Clear input"
                  @click="state.name = randomForceName()"
              />
            </UTooltip>
          </template>
        </UInput>

        <UInput v-model="state.description" placeholder="" :ui="{ base: 'peer' }" size="xl">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Description</span>
          </label>
        </UInput>

        <div>
          <USelect
              v-model="faction"
              :items="factions"
              :loading="status === 'pending'"
              size="xl"
              class="w-full"
          >
            <template #item-label="{ item }">
              {{ item.label }}
              <div class="text-muted">
                {{ item.sparks.join(', ') }}
              </div>
            </template>
          </USelect>
        </div>

        <div>

          <div class="w-full font-bold pb-4">Force Point Limit</div>

          <UFieldGroup size="xl" class="w-full">
            <UButton @click="setPointLimit(50)" class="w-1/4" color="info" :variant="pointLimitSelection === 50 ? undefined : 'outline'" label="50pts" />
            <UButton @click="setPointLimit(100)" class="w-1/4" color="info" :variant="pointLimitSelection === 100 ? undefined : 'outline'" label="100pts" />
            <UButton @click="setPointLimit(200)" class="w-1/4" color="info" :variant="pointLimitSelection === 200 ? undefined : 'outline'" label="200pts" />
            <UButton class="w-1/4" color="info" :variant="pointLimitSelection === -1 ? undefined : 'outline'" label="Custom" disabled />
          </UFieldGroup>

        </div>

        <div class="text-center">
          <UButton type="submit" size="xl" class="w-1/2">Create Force</UButton>
        </div>

        <div class="hidden">

          <h2>Activate Variant Rules</h2>

          <USwitch size="xl" label="Perks and Flaws" description="MACs get benefits and drawbacks"/>

          <USwitch size="xl" label="Remote Assets" description="Add off-board support effects" />

          <USwitch size="xl" label="Pilots" description="Add Ace and Rookie pilots"/>


        </div>

      </div>




    </UForm>
  </div>
</template>

<style scoped>

</style>