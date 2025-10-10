<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Force, VariantRule} from "~~/types/unit";
import variantRulesRepository, {type VariantRuleDefinition} from "~~/server/data/variantRulesRepository";
import factionRepository from "~~/server/data/factionRepository";

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string;

const force = computed(() => {
  return forcesStore.forceById(forceId);
});

const pointValue = computed(() => force.value ? calculateForceCost(force.value) : '?')

const mods = variantRulesRepository;

const factions = factionRepository.map(faction => {
  return {
    ...faction,
    avatar: { src: `/factions/${faction.key}-symbol.png` }
  }
});

const oldFaction = ref('')

function factionOpenEvent(event: boolean) {
  if (event) {
    oldFaction.value = force.value?.faction || '';
  }
}

function changeFaction(value: any) {
  console.log('changeFaction', oldFaction.value ,'->', value)

  const before = factionRepository.find(f => f.key === oldFaction.value)
  before?.onDetach(force.value)

  const after = factionRepository.find(f => f.key === value)
  after?.onAttach(force.value)
}

function changeVariantRule(value: boolean, mod: VariantRuleDefinition) {
  if (value) {
    force.value?.mods.push(mod.name)
    mod.onAttach(force.value)
  } else {
    const index = force.value?.mods.findIndex(m => m === mod.name)
    if (index === undefined) return;
    force.value?.mods.splice(index, 1);
    mod.onDetach(force.value)
  }
}

</script>

<template>
  <div v-if="force" class="flex flex-col justify-center w-full lg:w-3/4 mx-auto">


    <UForm class="space-y-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

      <div class="space-y-8">


        <UInput v-model="force.name" placeholder="" :ui="{ base: 'peer' }" size="xl" class="w-full">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Name</span>
          </label>
        </UInput>

        <UInput v-model="force.description" placeholder="" :ui="{ base: 'peer' }" size="xl" class="w-full">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Description</span>
          </label>
        </UInput>

        <!-- POINT Limit -->
        <UFieldGroup  class="w-full">
          <UBadge color="neutral" variant="subtle" class="w-32 justify-end">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="bg-default px-1t">Current points</span>
            </label>
            {{pointValue}} /
          </UBadge>
          <UInput v-model="force.pointLimit" placeholder="" :ui="{ base: 'peer' }" size="xl" type="number" min="0">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="bg-default px-1">Point Limit</span>
            </label>
          </UInput>
        </UFieldGroup>

        <!-- FACTION -->
        <div>
          <h3 class="font-bold">Faction</h3>
          <USelect
              v-model="force.faction"
              :items="factions"
              size="xl"
              class="w-full"
              placeholder="Unaligned"
              valueKey="key"
              labelKey="name"
              @update:open="factionOpenEvent($event)"
              @update:modelValue="changeFaction($event)"
          >
            <template #default="{ modelValue }">
              <UAvatar v-if="modelValue" :src="`/factions/${modelValue}-symbol.png`" class="size-12 mr-2" />
              <div class="flex flex-col text-left">
                <span>{{ factions.find(f => f.key === modelValue)?.name }}</span>
                <span class="text-neutral-400">{{ factions.find(f => f.key === modelValue)?.sparks.join(', ') }}</span>
              </div>
            </template>
            <template #item-label="{ item }">
              {{ item.name }}
              <div class="text-muted">
                {{ item.sparks.join(', ') }}
              </div>
            </template>
          </USelect>
          <UAlert
              icon="i-game-icons-info"
              color="info"
              variant="subtle"
              class="mt-2"
              description="Changing the faction might affect existing builds."
          ></UAlert>
        </div>

      </div>

      <div>
        <h2 class="font-bold text-xl mb-2">Enable Variant Rules</h2>

        <UAlert
            icon="i-game-icons-hazard-sign"
            color="warning"
            variant="subtle"
            class="mb-4 light:text-amber-600"
            title="Usage Notes"
            description="Important! Disabling a prior selected Variant Rule will remove all related antries and configs from the force. This cannot be undone."
        ></UAlert>

        <USwitch
            v-for="mod in mods"
            :modelValue="force.mods.includes(mod.name)"
            class="mt-4"
            :label="mod.name"
            :description="`${mod.hint} (see pg. ${mod.pages})`"
            @update:modelValue="changeVariantRule($event, mod)"
        />
      </div>

    </UForm>

  </div>
</template>

<style scoped>

</style>