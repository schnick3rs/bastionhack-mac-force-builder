<script setup lang="ts">
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import type {ModuleConfig, WeaponProfile} from "~~/types/unit";
import {getHardwareCatalogue} from "#shared/utils/modules";
import {useForcesStore} from "~/stores/forces";

const { clazz, module, previous, factionKey } = defineProps<{ clazz: number, module: ModuleConfig, previous?: ModuleConfig, factionKey: string | undefined }>()

const max = computed(() => {
  let slotOne = module.slot === 1 ? 1 : 0;
  return clazz + slotOne;
})

const forcesStore = useForcesStore();
const route = useRoute();
const forceId: string = route.params.forceId as string
const force = computed(() => {
  if (forceId) {
    return forcesStore.forceById(forceId);
  }
  return undefined;
})
const modDoubleModules = computed(() => {
  if (force) {
    const mods = force.value?.mods || [];
    return mods.includes('Double Modules');
  }
})

const emit = defineEmits(['setModule'])

function editWeapon(currentProfile: WeaponProfile) {
  console.info("Edit Weapon", currentProfile)
  newWeapon.value = currentProfile;
  mode.value = 'Weapon'
}

function addWeapon(weapon: WeaponProfile) {
  console.info('addWeapon', weapon)
  emit('setModule', { slot: module.slot, type: 'Weapon', profile: weapon })
  mode.value = ''
}

function duplicatePrevious() {
  if (!previous || previous.type === 'Empty') return
  const copy = JSON.parse(JSON.stringify(previous))
  emit('setModule', { ...copy, slot: module.slot })
  mode.value = ''
}

function removeModule() {
  emit('setModule', { slot: module.slot, type: 'Empty' })
}

const mode = ref('')

const hardware = getHardwareCatalogue(factionKey)
const hardwareOptions = computed(() => {
  if (!hardware) return [];
  return hardware
      .filter((h) => h.usability.includes("MAC") || h.usability.includes('All'))
})

const newWeapon = ref<WeaponProfile>();
const newModule = ref('');

function editHardware(currnetModuleName: string) {
  newModule.value = currnetModuleName
  openHardwareModal()
}

const hardwareModalOpen = ref(false)

function openHardwareModal() {
  mode.value = 'Hardware'
  hardwareModalOpen.value = true
}

function addHardware(name: string) {
  emit('setModule', { slot: module.slot, type: 'Hardware', profile: { name } })
  mode.value = ''
}

watch(hardwareModalOpen, (open) => {
  if (!open && mode.value === 'Hardware') mode.value = ''
})
</script>

<template>

  <!-- complete card row -->
  <div class="w-full flex flex-row gap-2 items-center">

    <UAvatar :text="`${module.slot}`" size="md" class="shrink-0"></UAvatar>

    <div class="flex-1 min-w-0">

      <span v-if="module.type === 'Weapon'">{{buildWeaponDisplayString(module.profile)}}</span>
      <span v-if="module.type === 'Hardware'">{{module.profile.name}}</span>
      <span v-if="module.type === 'Empty'" class="text-muted">{{module.type}}</span>

      <p v-if="module.type === 'Weapon'" class="text-sm text-gray-600 truncate dark:text-gray-300">
        <WeaponProfileTooltips :weapon="module.profile" />
      </p>

      <span v-if="modDoubleModules && module.type !== 'Empty'">
        <UCheckbox v-model="module.double"  class="pt-1" label="Double Module"></UCheckbox>
      </span>
    </div>

    <!-- actions -->
    <div class="flex items-center gap-1.5 shrink-0">

      <UButton
          v-if="module.type === 'Weapon'"
          size="sm"
          color="info"
          :variant="mode === 'Weapon' ? 'solid' : 'outline'"
          icon="i-material-symbols-light-edit-square-outline"
          class="cursor-pointer"
          aria-label="Edit weapon"
          @click="editWeapon(module.profile)"
      >
        <span class="hidden sm:inline">Weapon</span>
      </UButton>

      <UButton
          v-if="module.type === 'Hardware'"
          size="sm"
          color="info"
          :variant="mode === 'Hardware' ? 'solid' : 'outline'"
          icon="i-material-symbols-light-edit-square-outline"
          class="cursor-pointer"
          aria-label="Edit hardware"
          @click="editHardware(module.profile.name)"
      >
        <span class="hidden sm:inline">Hardware</span>
      </UButton>

      <UButton
          v-if="module.type !== 'Empty'"
          size="sm"
          icon="i-material-symbols-light-cancel-outline"
          color="error"
          variant="outline"
          class="cursor-pointer"
          aria-label="Remove module"
          @click="removeModule()">
      </UButton>

      <template v-if="module.type === 'Empty'">

        <UButton
            v-if="previous && previous.type !== 'Empty'"
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-material-symbols-light-content-copy-outline"
            title="Duplicate module above"
            aria-label="Duplicate module above"
            class="cursor-pointer"
            @click="duplicatePrevious()"
        />

        <UFieldGroup size="sm">
          <UButton
              color="info"
              :variant="mode === 'Weapon' ? 'solid' : 'outline'"
              class="cursor-pointer whitespace-nowrap"
              @click="mode = 'Weapon'">
            + Weapon
          </UButton>
          <UButton
              color="info"
              :variant="mode === 'Hardware' ? 'solid' : 'outline'"
              class="cursor-pointer whitespace-nowrap"
              @click="openHardwareModal()">
            + Hardware
          </UButton>
        </UFieldGroup>
      </template>

    </div>

  </div>

  <div v-if="mode" class="flex flex-col gap-1">

    <template v-if="mode === 'Weapon'">
      <EntryWeaponEditor :max="max" @add-weapon="addWeapon" :initialWeapon="newWeapon"></EntryWeaponEditor>
    </template>

  </div>

  <EntryHardwareSelectModal
      v-model:open="hardwareModalOpen"
      :items="hardwareOptions"
      :factionKey="factionKey"
      :selected="newModule"
      @select="addHardware"
  />

</template>

<style scoped>
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0;
}
</style>