<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type {TableColumn, TableRow} from '@nuxt/ui'
import {useForcesStore} from "~/stores/forces";
import type {Entry, Force, VariantRule} from "~~/types/unit";

const forcesStore = useForcesStore()
const forces = forcesStore.allForces;
const sortedForces = computed(() => forces.toSorted((a, b) => b.updatedAt - a.updatedAt))

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
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
    accessorKey: 'mods',
    header: 'Variant Rules',
    cell: ({ row }) => {
      let mods = row.getValue('mods') as VariantRule[];
      if (!mods) return '-';
      return h('div', { class: 'flex flex-col flex-wrap gap-2' },
          mods.map(mod =>
              h(UBadge, {
                color: 'neutral',
                variant: 'outline',
                icon: 'i-game-icons-gear-hammer',
              }, { default: () => mod })
          )
      );
    },
  },
  {
    accessorKey: 'pts',
    header: 'Points',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right',
      },
    },
    cell: ({ row }) => {
      let force = row.original;
      const forceCost = calculateForceCost(force)
      return `${forceCost} / ${force.pointLimit} pts`;
    },
  },
  {
    accessorKey: 'entries',
    header: '# Entries',
    meta: {
      class: {
        th: 'text-right',
        td: 'text-right',
      },
    },
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