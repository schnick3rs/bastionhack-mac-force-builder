<script setup lang="ts">
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import type {HardwareTag, ModuleConfig, WeaponProfile} from "~~/types/unit";
import {hardwareTags} from "~~/types/unit";
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

const activeTags = ref<HardwareTag[]>([])
function toggleTag(tag: HardwareTag) {
  const i = activeTags.value.indexOf(tag)
  if (i >= 0) activeTags.value.splice(i, 1)
  else activeTags.value.push(tag)
}
const filteredHardware = computed(() => {
  if (!activeTags.value.length) return hardwareOptions.value
  return hardwareOptions.value.filter(h => h.tags?.some(t => activeTags.value.includes(t)))
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
  hardwareModalOpen.value = false
  mode.value = ''
}

watch(hardwareModalOpen, (open) => {
  if (!open && mode.value === 'Hardware') mode.value = ''
})
</script>

<template>

  <!-- complete card row -->
  <div class="w-full flex flex-row gap-1 justify-between items-center">

    <!-- non  button content -->
    <div class="w-full flex flex-row gap-1 items-center">

      <div class="pr-2">
        <UAvatar :text="`${module.slot}`"></UAvatar>
      </div>

      <div class="flex-1">

        <span v-if="module.type === 'Weapon'">{{buildWeaponDisplayString(module.profile)}}</span>
        <span v-if="module.type === 'Hardware'">{{module.profile.name}}</span>
        <span v-if="module.type === 'Empty'">{{module.type}}</span>

        <p class="text-sm text-gray-600 truncate dark:text-gray-300">
          <WeaponProfileTooltips v-if="module.type === 'Weapon'" :weapon="module.profile" />
        </p>

        <span v-if="modDoubleModules && module.type !== 'Empty'">
          <UCheckbox v-model="module.double"  class="pt-1" label="Double Module"></UCheckbox>
        </span>
      </div>

    </div>

    <UButton
        v-if="module.type === 'Weapon'"
        color="info"
        :variant="mode === 'Weapon' ? 'solid' : 'outline'"
        icon="i-material-symbols-light-edit-square-outline"
        class="cursor-pointer"
        @click="editWeapon(module.profile)"
    >
      Weapon
    </UButton>

    <UButton
        v-if="module.type === 'Hardware'"
        color="info"
        :variant="mode === 'Hardware' ? 'solid' : 'outline'"
        icon="i-material-symbols-light-edit-square-outline"
        class="cursor-pointer"
        @click="editHardware(module.profile.name)"
    >
      Hardware
    </UButton>

    <UButton
        v-if="module.type !== 'Empty'"
        icon="i-material-symbols-light-cancel-outline"
        color="error"
        variant="outline"
        class="cursor-pointer w-fit"
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

      <UFieldGroup class="w-full justify-end">
        <UButton
            color="info"
            :variant="mode === 'Weapon' ? 'solid' : 'outline'"
            class="cursor-pointer"
            @click="mode = 'Weapon'">
          + Weapon
        </UButton>
        <UButton
            color="info"
            :variant="mode === 'Hardware' ? 'solid' : 'outline'"
            class="cursor-pointer"
            @click="openHardwareModal()">
          + Hardware
        </UButton>
      </UFieldGroup>
    </template>

  </div>

  <div v-if="mode" class="flex flex-col gap-1">

    <template v-if="mode === 'Weapon'">
      <EntryWeaponEditor :max="max" @add-weapon="addWeapon" :initialWeapon="newWeapon"></EntryWeaponEditor>
    </template>

  </div>

  <UModal
      v-model:open="hardwareModalOpen"
      title="Select Hardware"
      :ui="{ content: 'max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:w-screen max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none sm:h-[80vh] sm:max-h-[80vh] flex flex-col', body: 'flex-1 min-h-0 overflow-y-auto' }"
  >
    <template #body>
      <div class="flex flex-wrap gap-1 pb-3">
        <UButton
            v-for="tag in hardwareTags"
            :key="tag"
            size="xs"
            color="info"
            :variant="activeTags.includes(tag) ? 'solid' : 'outline'"
            class="cursor-pointer capitalize"
            @click="toggleTag(tag)"
        >
          {{ tag }}
        </UButton>
        <UButton
            v-if="activeTags.length"
            size="xs"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="activeTags = []"
        >
          Clear
        </UButton>
      </div>
      <p v-if="!filteredHardware.length" class="text-muted text-sm">No hardware matches the selected tags.</p>
      <ul class="flex flex-col divide-y divide-default">
        <li v-for="item in filteredHardware" :key="item.name">
          <button
              type="button"
              class="w-full text-left px-2 py-3 cursor-pointer hover:bg-elevated rounded flex flex-col gap-1"
              :class="{ 'bg-elevated': item.name === newModule }"
              @click="addHardware(item.name)"
          >
            <span class="font-medium flex items-center gap-1">
              {{ item.name }}
              <UAvatar v-if="factionKey && item.origin === 'faction'" :src="`/factions/${factionKey}-symbol.png`" class="size-4"/>
              <UBadge v-for="t in item.tags" :key="t" size="sm" color="neutral" variant="subtle" class="capitalize font-normal">{{ t }}</UBadge>
            </span>
            <span class="text-sm text-muted">{{ item.effect }}</span>
          </button>
        </li>
      </ul>
    </template>
  </UModal>

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