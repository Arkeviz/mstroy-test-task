<script setup lang="ts">
  import type { ColDef, ColGroupDef, ValueFormatterParams} from "ag-grid-enterprise"
  import type { TTreeItem } from "@/components/MSGrid/types"
  import { AgGridVue } from "ag-grid-vue3"
  import { AllEnterpriseModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise"
  import {computed, ref, watch} from "vue"
  import TreeStore from "@/components/MSGrid/composables/TreeStore.ts"

  ModuleRegistry.registerModules([AllEnterpriseModule])
  LicenseManager.setLicenseKey("")

  const props = defineProps<{
    /** Шапка таблицы */
    columns: (ColDef<TTreeItem> | ColGroupDef<TTreeItem>)[]
    /** Данные таблицы */
    data: TTreeItem[]
    /** Режим работы (просмотр/редактирование) */
    editMode: boolean
  }>()

  const defaultColDef = ref({ editable: false })

  const treeClass = new TreeStore(props.data)
  const computedTreeData = computed(() => Array.from(treeClass.tree.values()))

  watch(() => props.editMode, (val) => {
    defaultColDef.value.editable = val
  })

  defineExpose({
    tree: treeClass
  })
</script>

<template>
  <AgGridVue
    :columnDefs="props.columns"
    :rowData="computedTreeData"
  >
  </AgGridVue>
</template>

<style scoped>
</style>