<script setup lang="ts">
import type {Auxiliary, Formation, HardwareModule, HardwareProfile} from "~~/types/unit";
import WeaponProfileTooltips from "~/components/entry/WeaponProfileTooltips.vue";

const { entry } = defineProps<{ entry: Formation }>()
const unit: Auxiliary = entry.unit;

const weaponRangeItems = [
  { label: 'Brawl', value: '-', hint: 'Within melee'},
  { label: 'Short', value: 'S', hint: 'Max Range 12"'},
  { label: 'Long', value: 'L', hint: 'Min Range 6"'},
  { label: 'Arc', value: 'A', hint: 'Min Range 12, fire indirect"'},
]

const weaponTypeItems = [
  { label: 'Burst', value: 'B', hint: 'Reroll misses'},
  { label: 'Piercing', value: 'P', hint: 'Hits explode'},
  { label: 'Guided', value: 'G', hint: 'Use lowest Motionx2'},
  { label: 'Multi', value: 'M', hint: 'Attack 2nd target within 6" for 0 heat"'},
]

const powerItems = [
  { label: '1', value: '1', hint: 'Light cannons and guns' },
  { label: '2', value: '2', hint: 'Heavy mounted guns' },
  { label: '3', value: '3', hint: 'MAC-only weapons'},
  { label: '4', value: '4', hint: 'Largest MAC weapons'},
]

const weaponSubtypes = [
  { label: 'None', value: '-', hint: 'Just damage'},
  { label: 'Thermal', value: 'T', hint: 'Ignore Cover, cause heat'},
  { label: 'Jolt', value: 'J', hint: 'Jot deals ffamage on movement'},
  { label: 'Rad', value: 'R', hint: 'Deal damage then half Rad'},
]

const weapon = reactive({
  range: 'S',
  type: 'B',
  power: "2",
  subtype: '',
  expendable: true,
  name: 'RandomLaser',
})

const weaponDisplayName = computed(() => {
  const {range, type, power, name } = weapon;
  const subtype = `${weapon.subtype}${weapon.expendable ? 'X' : ''}`
  return `${range}${type}${power}${!!subtype ? '-' : ''}${subtype} ${name}`;
})

const module = ref('')

const modules = reactive([
  { slot: 1, name: weaponDisplayName },
  { slot: 2, name: 'Aerodrive', description: 'Ignore terrain' },
  { slot: 3, name: 'some' },
  { slot: 4, name: 'some' },
  { slot: 5, name: 'some' },
  { slot: 6, name: 'some' },
])

const { data: hardware, status } = await useFetch('/api/hardware', {
  key: 'typicode-users',
  transform: (data: HardwareModule[]) => data || [],
  lazy: true
})

const cost = computed(() => calculateFormationCost(entry))

function hardwareTooltip(hardwareProfile: HardwareProfile) {
  const hw = hardware.value?.find((h) => h.name === hardwareProfile.name)
  return hw?.effect ?? ''
}

const hardwareOptions = computed(() => {
  if (!hardware.value) return [];
  return hardware.value.filter((h) => h.usability.includes(unit.type) || h.usability.includes('All'))
      .filter((h) => !unit.modules.filter(m => m.type === 'Hardware').map(m => m.profile.name).includes(h.name))
})

const newModule = ref('');

function addModule() {
  const h = hardware.value?.find((h) => h.name === newModule.value);
  unit.modules.push({ type: 'Hardware', profile: { name: h.name } });
  unit.modules.sort((a, b) => {
    if (a.type === b.type) {
      return a.profile.name.localeCompare(b.profile.name)
    }
    return a.type.localeCompare(b.type)
  });
  newModule.value = '';
}

function removeModule(name: string, index: number) {
  const weaponCount = unit.modules.filter(m => m.type === 'Weapon').length
  unit.modules.splice(index+weaponCount, 1);
  unit.modules.sort((a, b) => {
    if (a.type === b.type) {
      return a.profile.name.localeCompare(b.profile.name)
    }
    return a.type.localeCompare(b.type)
  });
}

</script>

<template>

  <div class="flex gap-2 justify-between items-center">
    <UInput v-model="unit.name" class=""></UInput>
    <span class="w-12 flex-none">{{cost}} pt</span>
  </div>

  <h3 class="text-xs">
    Size <UInput v-model="entry.size" class="w-12 mx-2" type="number" min="1" :max="entry.unit.type === 'Infantry' ? 5 : 3" size="xs" ></UInput> {{unit.type}} Formation
  </h3>

  <h3 class="text-2xl font-bold">Modules</h3>
  <em class="text-xs">AUs can carry any number of modules, but cannot have more than 2 weapons or more than 2 of the same hardware.</em>

  <h4 class="text-xl">Weapons</h4>

  <UPageList>
    <UPageCard v-for="(module, index) in unit.modules.filter(m => m.type === 'Weapon')" :key="index" class="mb-2">
      <UUser>
        <template #name>
          <span >{{buildWeaponDisplayString(module.profile)}}</span>
        </template>
        <template #description>
          <WeaponProfileTooltips :weapon="module.profile" />
        </template>
      </UUser>
    </UPageCard>
  </UPageList>

  <h4 class="text-xl">Hardware modules</h4>

  <div class="flex flex-wrap gap-2">
    <template v-for="(module, index) in unit.modules.filter(m => m.type === 'Hardware')" :key="index" >
      <UBadge color="neutral" variant="subtle" size="xl">
        <UTooltip :delay-duration="0" :text="hardwareTooltip(module.profile)">
          <span style="text-decoration: underline dashed; text-underline-offset: 4px">{{module.profile.name}}</span>
        </UTooltip>
        <UIcon size="20" name="i-material-symbols-light-cancel" class="cursor-pointer" @click="removeModule(module.profile.name, index)"></UIcon>
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

    <UButton variant="outline" @click="addModule">Add Module</UButton>
  </UFieldGroup>

</template>

<style scoped>

</style>