<script setup lang="ts">
  import type { ColDef } from "ag-grid-enterprise"
  import type { TTreeItem } from "@/components/MSTree/types"
  import { provide, ref, useTemplateRef } from "vue"
  import { IsEditModeKey } from "@/constants"
  import MSTree from "@/components/MSTree/MSTree.vue"

  const columns: ColDef<TTreeItem>[] = [
    {
      headerName: '№ п/n',
      field: 'treeIndex',
      width: 150,
      valueGetter: (p) =>
        p?.node?.rowIndex != null
          ? p.node.rowIndex + 1
          : null
    },
    {
      headerName: 'Наименование',
      field: 'label',
      flex: 1,
      get editable() {
        return isEditMode.value
      }
    }
  ]

  const groupColumn: ColDef = {
    headerName: 'Категория',
    flex: 1,
    cellRendererParams: {
      suppressCount: true,
    },
    valueGetter: (p) => p.data?.children?.length ? 'Группа' : 'Элемент'
  }

  const data: TTreeItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '2', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '2', label: 'Айтем 4' },
    { id: 5, parent: '2', label: 'Айтем 5' },
    { id: 6, parent: '2', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]

  const isEditMode = ref(false)
  const toggleMode = () => {
    isEditMode.value = isEditMode.value
  }

  provide(IsEditModeKey, {
    isEditMode,
    toggleMode
  })

  const treeRef = useTemplateRef<InstanceType<typeof MSTree>>('treeRef')
</script>

<template>
  <main class="main-container">
    <MSTree
      ref="treeRef"
      :columns
      :data
      :isEditMode
      :groupColumn
      expand-all
    />
  </main>
</template>

<style scoped>
  .main-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
