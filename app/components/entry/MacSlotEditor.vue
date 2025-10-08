<script setup lang="ts">
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";
import type {ModuleConfig, WeaponProfile} from "~~/types/unit";
import {getHardwareCatalogue} from "#shared/utils/modules";

const { clazz, module, factionKey } = defineProps<{ clazz: number, module: ModuleConfig, factionKey: string | undefined }>()

const max = computed(() => {
  let slotOne = module.slot === 1 ? 1 : 0;
  return clazz + slotOne;
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

  <div class="w-full flex gap-1 justify- items-center">

    <UUser :avatar="{ text: `${module.slot}` }" class="flex-1">
      <template #name>
        <span v-if="module.type === 'Weapon'">{{buildWeaponDisplayString(module.profile)}}</span>
        <span v-if="module.type === 'Hardware'">{{module.profile.name}}</span>
        <span v-if="module.type === 'Empty'">{{module.type}}</span>
      </template>
      <template #description>
        <WeaponProfileTooltips v-if="module.type === 'Weapon'" :weapon="module.profile" />
      </template>
    </UUser>

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

      <UFieldGroup>
        <UButton
            color="info"
            :variant="mode === 'Weapon' ? 'solid' : 'outline'"
            class="flex-1 cursor-pointer"
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
    <hr >

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