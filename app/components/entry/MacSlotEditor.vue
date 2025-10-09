<script setup lang="ts">
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import type {ModuleConfig, WeaponProfile} from "~~/types/unit";
import {getHardwareCatalogue} from "#shared/utils/modules";
import {useForcesStore} from "~/stores/forces";

const { clazz, module, factionKey } = defineProps<{ clazz: number, module: ModuleConfig, factionKey: string | undefined }>()

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
  mode.value = 'Hardware'
}

function addHardware() {
  const h = hardware.find((h) => h.name === newModule.value);
  if (!h) return;
  emit('setModule', { slot: module.slot, type: 'Hardware', profile: { name: h.name} })
  mode.value = ''
}
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
            @click="mode = 'Hardware'">
          + Hardware
        </UButton>
      </UFieldGroup>
    </template>

  </div>

  <div v-if="mode" class="flex flex-col gap-1">

    <template v-if="mode === 'Weapon'">
      <EntryWeaponEditor :max="max" @add-weapon="addWeapon" :initialWeapon="newWeapon"></EntryWeaponEditor>
    </template>

    <template v-if="mode === 'Hardware'">
      <UFieldGroup oientation="horizontal">

        <UBadge color="neutral" variant="subtle">Select to add Hardware</UBadge>

        <USelectMenu
            v-if="hardwareOptions"
            :items="hardwareOptions"
            value-key="name"
            label-key="name"
            class="flex-1"
            v-model="newModule"
            @change="addHardware"
        >
          <template #item-label="{ item }">
            {{ item.name }}
            <template v-if="factionKey && item.origin === 'faction'">
              <UAvatar :src="`/factions/${factionKey}-symbol.png`" class="size-4 mb-1"/>
            </template> :
            <div class="text-muted">
              {{ item.effect }}
            </div>
          </template>
        </USelectMenu>

      </UFieldGroup>
    </template>

  </div>

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