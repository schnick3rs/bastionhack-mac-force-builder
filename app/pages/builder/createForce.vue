<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {useForcesStore} from "~/stores/forces";

const state =  reactive({
  name: '',
  description: '',
  pointLimit: 50,
  faction: '',
})

const { data: factions, status } = await useFetch('/api/factions', {
  key: 'typicode-users',
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(faction => ({
      label: faction.name,
      value: faction.key,
      sparks: faction.sparks,
      avatar: { src: `/factions/${faction.key}-leader-avatar.png` }
    }))
  },
  lazy: true
})

const forces = useForcesStore()
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })

  let force = event.data;

  const createdForce = await forces.createNewForceList(force)

  console.log('force', createdForce)
  navigateTo(`/builder/${createdForce.id}`)
}

</script>

<template>
  <h2>Create a new force</h2>

  <UForm :state="state" class="space-y-4 mt-8" @submit="onSubmit">

    <div class="flex flex-col gap-8 w-92">

      <UInput v-model="state.name" placeholder="" :ui="{ base: 'peer' }" size="xl">
        <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
          <span class="inline-flex bg-default px-1">Name</span>
        </label>
      </UInput>

      <UInput v-model="state.description" placeholder="" :ui="{ base: 'peer' }" size="xl">
        <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
          <span class="inline-flex bg-default px-1">Description</span>
        </label>
      </UInput>

      <USelect
          v-model="state.faction"
          :items="factions"
          :loading="status === 'pending'"
          size="xl"
      >
        <template #item-label="{ item }">
          {{ item.label }}
          <div class="text-muted">
            {{ item.sparks.join(', ') }}
          </div>
        </template>
      </USelect>

      <h2>Point Limit</h2>

      <UFieldGroup size="xl">
        <UButton color="neutral" variant="subtle" label="50 pts" />
        <UButton color="neutral" variant="outline" label="100 pts" />
        <UButton color="neutral" variant="outline" label="200 pts" />
      </UFieldGroup>

      <h2>Activate Variant Rules</h2>

      <USwitch size="xl" label="Perks and Flaws" description="MACs get benefits and drawbacks"/>

      <USwitch size="xl" label="Remote Assets" description="Add off-board support effects" />

      <USwitch size="xl" label="Pilots" description="Add Ace and Rookie pilots"/>

      <UButton type="submit" >Open Force Builder</UButton>
    </div>




  </UForm>
</template>

<style scoped>

</style>