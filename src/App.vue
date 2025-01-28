<script setup lang="ts">
  import type { ColDef, ValueFormatterParams } from "ag-grid-enterprise"
  import type { TTreeItem } from "@/components/MSGrid/types"
  import MSTree from "@/components/MSGrid/MSTree.vue"
  import {ref} from "vue";

  const editMode = ref(false)

  const columns: ColDef<TTreeItem>[] = [
    {
      headerName: '№ п/n',
      field: "id"
    },
    {
      headerName: 'Категория',
      field: "children",
      valueFormatter: (params: ValueFormatterParams<TTreeItem, number[]>) => {
        return params.data?.children?.length ? 'Группа' : 'Элемент'
      },
    },
    {
      headerName: 'Наименование',
      field: "label",
      get editable() {
        return editMode.value
      }
    }
  ]

  const data: TTreeItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '2', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '2', label: 'Айтем 4' },
    { id: 5, parent: '2', label: 'Айтем 5' },
    { id: 6, parent: '2', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
    { id: 9, parent: 8, label: 'Айтем 9' }
  ]
</script>

<template>
  <main class="container">
    <MSTree class="ms-grid" :columns :data :editMode />
  </main>
</template>

<style scoped>
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ms-grid {
    width: 900px;
    height: 500px;
  }
</style>
