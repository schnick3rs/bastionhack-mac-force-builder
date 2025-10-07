<script setup lang="ts">
  import {useForcesStore} from "~/stores/forces";
  import type {Force} from "~~/types/unit";
  import {validateForce} from "#shared/utils/forces";

  const forcesStore = useForcesStore();
  const route = useRoute();
  const forceId: string = route.params.forceId as string;
  const force: Force | undefined = forcesStore.forceById(forceId)
  if (!force) {
    throw new Error('Force not found')
  }

  const { data: faction } = await useFetch(`/api/factions/${force.faction}`, { lazy: true });

  function addMac() {
    const id = forcesStore.addNewEntry(forceId, 'MAC');
    console.info('New MAC added', id)
    if (id) {
      selectEntry(id)
    }
  }
  function addVehicleFormation() {
    const id = forcesStore.addNewEntry(forceId, 'Vehicle');
    console.info('New Vehicle added', id)
    if (id) {
      selectEntry(id)
    }
  }
  function addInfantryFormation() {
    const id = forcesStore.addNewEntry(forceId, 'Infantry');
    console.info('New Infantry added', id)
    if (id) {
      selectEntry(id)
    }
  }

  const remoteAssetModelOpen = ref(false)
  const remoteAsset = reactive({
    name: '',
    cost: 1,
    effect: '',
  })

  function addRemoteAsset() {
    const entryTemplate = {
      name: remoteAsset.name,
      cost: remoteAsset.cost,
      effect: remoteAsset.effect,
    }
    const id = forcesStore.addNewEntry(forceId, 'Remote Asset', entryTemplate);
    remoteAsset.name = '';
    remoteAsset.cost = 1;
    remoteAsset.effect = '';
    console.info('New RemoteAsset added', id)
    if (id) {
      selectEntry(id)
    }
    remoteAssetModelOpen.value = false;
  }

  function removeEntry(entryId: string) {
    if (selected.value === entryId) {
      selected.value = '';
      // TODO push to parent
      navigateTo( {path: `/builder/${forceId}/entries`})
    }
    forcesStore.removeEntry(forceId, entryId);
  }

  const selected = ref('')

  function selectEntry(entryId: string) {
    selected.value = entryId
    navigateTo( {path: `/builder/${forceId}/entries/${entryId}`})
  }

  const cost = computed(() => calculateForceCost(force));

  const validate = computed(() => validateForce(force))

</script>

<template>

  <div>
    <UUser
        :avatar="{ src: `/factions/${force.faction}-symbol.png` }"
        :name="force.name"
        :description="`${faction?.name}`"
    >
    </UUser>
  </div>

  <em>{{ force.description }}</em>

  <div class="font-xl">
    <span>Point {{cost}} / {{force.pointLimit}} pts</span>
    - <span class="text-sm">[{{force.entries.length}} entries]</span>
    <span v-if="force.mods && force.mods.length > 0">{{ force.mods }}</span>
  </div>


  <UFieldGroup class="py-4">
    <UButton color="info" variant="outline" @click="addMac">Add MAC</UButton>
    <UButton color="info" variant="outline" @click="addVehicleFormation">Add Vehicle Formation</UButton>
    <UButton color="info" variant="outline" @click="addInfantryFormation">Add Infantry Formation</UButton>

    <UModal
        v-if="force.mods?.includes('Remote Assets')"
        v-model:open="remoteAssetModelOpen"
        title="Add Remote Asset"
        description="Add a remote asset to the force"
    >
      <UButton
          color="info"
          variant="outline"
      >
        Add Remote Asset
      </UButton>

      <template #body>
        <div class="flex flex-col gap-2">

          <UInput v-model="remoteAsset.name" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-2">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">Name</span>
            </label>
          </UInput>

          <UInput v-model="remoteAsset.cost" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-2" type="number" min="1" max="5">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">Cost (pts)</span>
            </label>
          </UInput>

          <UTextarea v-model="remoteAsset.effect" placeholder="" :ui="{ base: 'peer' }" size="xl" class="mb-2" :rows="6" autoresize>
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">effect</span>
            </label>
          </UTextarea>

          <UButton @click="addRemoteAsset">Add Asset</UButton>
        </div>
      </template>
    </UModal>

    <UTooltip v-else text="Enable Remote Assets Variant Rule">
      <UButton color="neutral" variant="subtle" disabled @click="addRemoteAsset">Add Remote Asset</UButton>
    </UTooltip>
  </UFieldGroup>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" >

    <div>

      <UPageList>
        <UPageCard
            class="mb-3"
            :ui="{ container: 'sm:p-4' }"
            highlight-color="info"
            :highlight="entry.id === selected"
            v-for="entry in force?.entries"
            variant="subtle"
            orientation="vertical"
            @click="selectEntry(entry.id)"
        >
          <EntryPreviewItem :entry="entry" @removeEntry="removeEntry($event)"></EntryPreviewItem>
        </UPageCard>
      </UPageList>

      <!-- Validation -->
      <div class="mt-4">
        <ul>
          <li v-for="v in validate" class="mb-2">
            <UAlert v-if="v.valid" icon="i-material-symbols-light-check-circle-outline" color="success" variant="soft" :title="v.message" :ui="{ root: 'p-2'}"></UAlert>
            <UAlert v-else icon="i-material-symbols-light-error-outline" color="error" variant="soft" :title="v.message" :ui="{ root: 'p-2'}"></UAlert>
          </li>
        </ul>
      </div>

      <pre class="hidden">
        {{ force }}
      </pre>
    </div>

    <div :key="selected">
      <NuxtPage/>
    </div>

  </div>

</template>
