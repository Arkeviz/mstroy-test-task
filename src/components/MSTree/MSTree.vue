<script setup lang="ts">
  import type { ColDef, ColGroupDef, GetDataPath, GridApi, GridReadyEvent } from "ag-grid-enterprise"
  import type { TNodeId, TTreeItem } from "@/components/MSTree/types"
  import { computed, ref, shallowRef } from "vue"
  import { AgGridVue } from "ag-grid-vue3"
  import { AllEnterpriseModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise"
  import TreeStore from "@/components/MSTree/composables/TreeStore.ts"

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
    /** Режим работы (просмотр/редактирование) */
    editMode: boolean
  }>()

  const gridApi = shallowRef<GridApi | null>(null)

  const getDataPath = ref<GetDataPath>((data) => data?.path)

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

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
    // Переставляю столбец "№ п/п" в начало таблицы
    // TODO найти нормальное решение
    gridApi.value.moveColumnByIndex(1,0)
  }

  const computedExpandAll = computed(() => props?.expandAll ? -1 : 0)

  defineExpose({
    addItem: (item: TTreeItem) => tree.value.addItem(item),
    updateItem: (item: TTreeItem) => tree.value.updateItem(item),
    removeItem: (id: TNodeId) => tree.value.removeItem(id),
  })
</script>

<template>
  <AgGridVue
    :columnDefs="props.columns"
    :rowData="computedTreeData"
    :auto-group-column-def="props.groupColumn"
    tree-data
    :getDataPath="getDataPath"
    :groupDefaultExpanded="computedExpandAll"
    @grid-ready="onGridReady"
  >
  </AgGridVue>
</template>

<style scoped>
</style>