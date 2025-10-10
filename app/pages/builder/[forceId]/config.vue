<script setup lang="ts">
import {useForcesStore} from "~/stores/forces";
import type {Force, VariantRule} from "~~/types/unit";
import variantRulesRepository, {type VariantRuleDefinition} from "~~/server/data/variantRulesRepository";

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string;

const force = computed(() => {
  return forcesStore.forceById(forceId);
});

const pointValue = computed(() => force.value ? calculateForceCost(force.value) : '?')

const mods = variantRulesRepository;

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
  <div v-if="force" class="flex flex-col justify-center w-2/3 mx-auto">

    <h1 class="text-2xl font-bold">Force Config</h1>

    <UForm class="space-y-4 mt-8 grid grid-cols-2 gap-8">

      <div class="space-y-8">

        <h2 class="font-bold text-xl mb-2">Flavour</h2>

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
          <UBadge color="neutral" variant="subtle" class="w-20">{{pointValue}} / </UBadge>
          <UInput v-model="force.pointLimit" placeholder="" :ui="{ base: 'peer' }" size="xl" type="number" min="0">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="bg-default px-1">Point Limit</span>
            </label>
          </UInput>
        </UFieldGroup>

        <!-- FACTION -->
        <UInput v-model="force.faction" placeholder="" :ui="{ base: 'peer' }" size="xl" class="w-full">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Faction</span>
          </label>
        </UInput>

      </div>

      <div>
        <h2 class="font-bold text-xl mb-2">Enable Variant Rules</h2>

        <UAlert
            color="warning"
            variant="subtle"
            icon="i-material-symbols-light-settings-alert"
            title="Usage Notes"
            class="mb-4 light:text-amber-600"
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