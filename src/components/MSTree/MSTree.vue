<script setup lang="ts">
import type { CellEditRequestEvent, ColDef, ColGroupDef, GetDataPath, GridApi, GridReadyEvent } from "ag-grid-enterprise"
import { AllEnterpriseModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise"
import type { TNodeId, TTreeItem } from "@/components/MSTree/types"
import { computed, provide, ref, shallowRef } from "vue"
import { AgGridVue } from "ag-grid-vue3"
import { itemEditKey } from "@/constants"
import TreeStore from "@/components/MSTree/composables/TreeStore.ts"
import MSTreeControls from "@/components/MSTree/components/MSTreeControls.vue"

ModuleRegistry.registerModules([AllEnterpriseModule])
  LicenseManager.setLicenseKey("")

  const props = defineProps<{
    /** Шапка таблицы */
    columns: (ColDef<TTreeItem> | ColGroupDef<TTreeItem>)[]
    /** Настройка группировки в таблице */
    groupColumn: ColDef<TTreeItem>
    /** Данные таблицы */
    data: TTreeItem[]
    /** Раскрыть всё по умолчанию */
    expandAll?: boolean
  }>()

  const tree = ref(new TreeStore(props.data))
  const computedTreeData = computed(
    () => tree.value.tree.map((node, index) => {
      const path = tree.value.getAllParents(node.id).reduce((acc, item) => {
        acc.push(item.id)
        return acc
      }, [] as TNodeId[])
      return ({
        ...node,
        treeIndex: index + 1,
        path: path.reverse().join(''),
      })
    })
  )

  const computedExpandAll = computed(() => props?.expandAll ? -1 : 0)

  const gridApi = shallowRef<GridApi | null>(null)
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
  }

  const getDataPath = ref<GetDataPath>((data) => data?.path)

  const addItem = (data: TTreeItem) => {
    console.warn('data ADD', data)
    tree.value.addItem({ parent: data.parent })
  }

  const deleteItem = (data: TTreeItem) => {
    console.warn('data REMOVE', data)
    const deletedChildren = tree.value.getAllChildren(data.id)
    tree.value.removeItem(data.id)
  }

  const editItem = (event: CellEditRequestEvent) => {
    console.warn('data UPDATE', event)
    if (event.source !== 'edit') return
    tree.value.updateItem({ ...event.data, label: event.newValue })
  }

  const onUndoChange = () => {
    console.warn('undo')
  }

  const onRedoChange = () => {
    console.warn('redo')
  }

  provide(itemEditKey, {
    addItem,
    deleteItem
  })

  defineExpose({
    addItem: (item: TTreeItem) => tree.value.addItem(item),
    updateItem: (item: TTreeItem) => tree.value.updateItem(item),
    removeItem: (id: TNodeId) => tree.value.removeItem(id),
  })
</script>

<template>
  <div class="tree-container">
    <MSTreeControls
      class="control-panel"
      @undo-change="onUndoChange"
      @redo-change="onRedoChange"
    />
    <AgGridVue
      :columnDefs="props.columns"
      :rowData="computedTreeData"
      :auto-group-column-def="props.groupColumn"
      :getDataPath="getDataPath"
      :groupDefaultExpanded="computedExpandAll"
      tree-data
      readOnlyEdit
      class="ms-tree"
      @grid-ready="onGridReady"
      @cell-edit-request="editItem"
    />
  </div>
</template>

<style scoped>
  .tree-container {
    width: 900px;
  }

  .ms-tree {
    width: 100%;
    height: 450px;
  }

  .control-panel {
    width: 100%;
    margin-bottom: 8px;
  }

  /* Стили для cellRenderer категорий */
  :deep(.ag-group-value) {
    width: 100%;
  }
</style>