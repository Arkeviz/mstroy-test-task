<script setup lang="ts">
  import type { CellEditRequestEvent, ColDef, ColGroupDef, GetDataPath, GridApi, GridReadyEvent } from "ag-grid-enterprise"
  import type { TNodeId, TTreeItem } from "@/components/MSTree/types"
  import { computed, ref, shallowRef } from "vue"
  import { AgGridVue } from "ag-grid-vue3"
  import { AllEnterpriseModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise"
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
    // Переставляю столбец "№ п/п" в начало таблицы
    // при инициализации слайдера
    // TODO при смене режима возвращается обратно, найти нормальное решение
    gridApi.value.moveColumnByIndex(1,0)
  }

  const getDataPath = ref<GetDataPath>((data) => data?.path)

  const handleEdit = (event: CellEditRequestEvent) => {
    if (event.source !== 'edit') return
    tree.value.updateItem({ ...event.data, label: event.newValue })
  }

  defineExpose({
    addItem: (item: TTreeItem) => tree.value.addItem(item),
    updateItem: (item: TTreeItem) => tree.value.updateItem(item),
    removeItem: (id: TNodeId) => tree.value.removeItem(id),
  })
</script>

<template>
  <div class="tree-container">
    <MSTreeControls class="control-panel" />
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
      @cell-edit-request="handleEdit"
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
</style>