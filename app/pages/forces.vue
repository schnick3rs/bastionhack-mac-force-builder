<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type {TableColumn, TableRow} from '@nuxt/ui'
import {useForcesStore} from "~/stores/forces";
import type {Entry, Force} from "~~/types/unit";

const forcesStore = useForcesStore()

const sortedForces = computed(() => forcesStore.forces.toSorted((a, b) => b.updatedAt - a.updatedAt))

const UButton = resolveComponent('UButton')
const columns: TableColumn<Force>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'faction',
    header: 'Faction',
    cell: ({ row }) => {
      let factionKey = row.getValue('faction') as string;
      return factionKey ? factionName(factionKey) : '-'
    },
  },
  {
    accessorKey: 'pts',
    header: 'Points',
    cell: ({ row }) => {
      let force = row.original;
      const forceCost = calculateForceCost(force)
      return `${forceCost} / ${force.pointLimit} pts`;
    },
  },
  {
    accessorKey: 'entries',
    header: '# Entries',
    cell: ({ row }) => {
      let entries = row.getValue('entries') as Entry[];
      return entries.length;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Modified',
    cell: ({ row }) => {
      let updatedAt = row.getValue('updatedAt') as number;
      return `${new Date(updatedAt).toLocaleString("en-GB", {  year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      let force = row.original;
      return h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          icon: 'i-material-symbols-light-edit-outline',
          color: 'info',
          variant: 'ghost',
          size: 'sm',
          to: `/builder/${force.id}/entries`,
        }, { default: () => 'Edit' }),
        h(UButton, {
          icon: 'i-material-symbols-light-cancel-outline',
          color: 'error',
          variant: 'ghost',
          size: 'sm',
          onClick: () => deleteForce(force)
        }, { default: () => 'Delete' }),
      ]);
    }
  },
]

const deleteForce = (force: force) => {
  const forceName = force.name;
  forcesStore.deleteForce(force.id)
  const toast = useToast()
  toast.add({ title: 'Deleted', description: `Force '${forceName}' was removed!`, color: 'error' });
}

const selectedRow = ref<TableRow<Force> | null>(null)
function onHover(_e: Event, row: TableRow<Force> | null) {
  selectedRow.value = row
}

function onSelect(row: TableRow<Force>, e?: Event) {
  /* If you decide to also select the column you can do this  */
  useRouter().push(`/builder/${row.original.id}/entries`)
}

</script>

<template>
  <UTable
      :loading="forcesStore.hydrated === false"
      :columns="columns"
      :data="sortedForces"
      @hover="onHover"
      @select="onSelect"
  ></UTable>
</template>

<style scoped>

</style>