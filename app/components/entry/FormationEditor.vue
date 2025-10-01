<script setup lang="ts">
import type {Auxiliary, Formation, HardwareModule, HardwareProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const { entry } = defineProps<{ entry: Formation }>()
const unit: Auxiliary = entry.unit;

const { data: hardware, status } = await useFetch('/api/hardware', {lazy: true})

const cost = computed(() => calculateFormationCost(entry))

function hardwareTooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.value?.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

const hardwareOptions = computed(() => {
  if (!hardware.value) return [];
  return hardware.value.filter((h) => h.usability.includes(unit.type) || h.usability.includes('All'))
      .filter((h) => !unit.hardware.map(h => h.name).includes(h.name))
})

const newModule = ref('');

function addHardware() {
  const h = hardware.value?.find((h) => h.name === newModule.value);
  if (!h) return;
  unit.hardware.push({ name: h.name });
  unit.hardware.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });
  newModule.value = '';
}

function removeHardware(name: string, index: number) {
  const weaponCount = unit.weapons.length
  unit.hardware.splice(index, 1);
  unit.hardware.sort((a, b) => {
    return a.name.localeCompare(b.name)
  });
}

</script>

<template>

  <div class="font-light font-mono text-sm"># {{entry.id}}</div>

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="unit.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Size <UInput v-model="entry.size" class="w-12 mx-2" type="number" min="1" :max="entry.unit.type === 'Infantry' ? 5 : 3" size="xs" ></UInput> {{unit.type}} Formation
  </h3>

  <div>
    <h3 class="text-2xl font-bold">Modules</h3>
    <p class="text-xs italic">AUs can carry any number of modules, but cannot have more than 2 weapons or more than 2 of the same hardware.</p>
  </div>

  <h4 class="text-xl">Weapons</h4>

  <UPageList>
    <UPageCard v-for="(weapon, index) in unit.weapons" :key="index" class="mb-2">
      <UUser>
        <template #name>
          <span >{{buildWeaponDisplayString(weapon)}}</span>
        </template>
        <template #description>
          <WeaponProfileTooltips :weapon="weapon" />
        </template>
      </UUser>
    </UPageCard>
  </UPageList>

  <h4 class="text-xl">Hardware modules</h4>

  <div class="flex flex-wrap gap-2">
    <template v-for="(hardware, index) in unit.hardware" :key="index" >
      <UBadge color="neutral" variant="subtle" size="xl">
        <UTooltip :delay-duration="0" :text="hardwareTooltip(hardware)">
          <span style="text-decoration: underline dashed; text-underline-offset: 4px">{{hardware.name}}</span>
        </UTooltip>
        <UIcon size="20" name="i-material-symbols-light-cancel" class="cursor-pointer" @click="removeHardware(hardware.name, index)"></UIcon>
      </UBadge>
    </template>
  </div>

  <UFieldGroup orientation="horizontal">
    <USelectMenu
        v-if="hardwareOptions"
        :items="hardwareOptions"
        value-key="name"
        label-key="name"
        :loading="status === 'pending'"
        class="flex-1"
        v-model="newModule"
    >
      <template #item-label="{ item }">
        {{ item.name }}
        <div class="text-muted">
          {{ item.effect }}
        </div>
      </template>
    </USelectMenu>

    <UButton variant="outline" @click="addHardware">Add Hardware</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>