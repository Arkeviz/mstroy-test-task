<script setup lang="ts">
  import type { ColDef } from "ag-grid-enterprise"
  import type { TTreeItem } from "@/components/MSGrid/types"
  import { ref, useTemplateRef } from "vue"
  import MSTree from "@/components/MSGrid/MSTree.vue"

  const columns: ColDef<TTreeItem>[] = [
    {
      headerName: '№ п/n',
      field: 'treeIndex',
      width: 150,
    },
    {
      headerName: 'Наименование',
      field: 'label',
      flex: 1,
      get editable() {
        return editMode.value
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

  const editMode = ref(false)

  const treeRef = useTemplateRef<InstanceType<typeof MSTree>>('treeRef')
</script>

<template>
  <main class="container">
    <div class="tree-container">
      <MSTree
        ref="treeRef"
        class="ms-grid"
        :columns
        :data
        :editMode
        :groupColumn
        expand-all
      />
    </div>
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

  .tree-container {
    width: 900px;
  }

  .ms-grid {
    width: 100%;
    height: 700px;
  }
</style>
