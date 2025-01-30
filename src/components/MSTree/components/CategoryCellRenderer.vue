<script setup lang="ts">
  import type { ICellRendererParams } from "ag-grid-enterprise"
  import type { TTreeItem } from "@/components/MSTree/types"
  import { computed, inject } from "vue"
  import { itemEditKey } from "@/constants"
  import MsIcon from "@/components/icons/MsIcon.vue"

  const { params } = defineProps<{
    params: ICellRendererParams<TTreeItem> & { isEditable: boolean }
  }>()

  const categoryName = computed(() => params.data?.children?.length ? 'Группа' : 'Элемент')
  const isEditable = computed(() => params.isEditable)

  const { addItem, removeItem } = inject(itemEditKey)
</script>

<template>
  <div class="ms-tree__cell-renderer_category">
    <p class="ms-tree__category-name">{{ categoryName }}</p>

    <div v-if="isEditable" class="ms-tree__cell-buttons">
      <button
        class="ms-tree__category_cell-button button_transparent"
        @click="addItem(params.data)"
      >
        <MsIcon icon="add-rounded" class="ms-tree__add-rounded-icon" />
      </button>
      <button
        class="ms-tree__category_cell-button button_transparent"
        @click="removeItem(params.data)"
      >
        <MsIcon icon="cancel-rounded" class="ms-tree__cancel-rounded-icon" />
      </button>
    </div>
  </div>
</template>

<style>
  .ms-tree__cell-renderer_category {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 0.25rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .ms-tree__cell-renderer_category .ms-icon {
    width: 20px;
    height: 20px;
    font-size: 16px;
  }

  .ms-tree__cell-buttons {
    display: flex;
    gap: 0 2px;
  }

  .ms-tree__add-rounded-icon {
    color: dodgerblue;
  }

  .ms-tree__cancel-rounded-icon {
    color: #ff4444;
  }

  .ms-tree__add-rounded-icon,
  .ms-tree__cancel-rounded-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .button_transparent {
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: fit-content;
    padding: 0;
  }
</style>