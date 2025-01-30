<script setup lang="ts">
  import { computed, inject } from "vue"
  import { IsEditModeKey } from "@/constants"
  import MsIcon from "@/components/icons/MsIcon.vue"
  import type {THistoryChangeItem} from "@/components/MSTree/types/changeHistory.ts";

  const { changesHistory, currentChangeIndex } = defineProps<{
    changesHistory: THistoryChangeItem[]
    currentChangeIndex: number
  }>()

  const emits = defineEmits<{
    redoChange: []
    undoChange: []
  }>()

  const { isEditMode, toggleMode } = inject(IsEditModeKey)

  const isUndoDisabled = computed(() => currentChangeIndex < 0)
  const isRedoDisabled = computed(() => currentChangeIndex >= changesHistory?.length - 1)

  const onUndo = () => {
    emits('undoChange')
  }
  const onRedo = () => {
    emits('redoChange')
  }
</script>

<template>
  <div class="controls">
    <button class="controls__button_edit button_transparent" @click="isEditMode = !isEditMode">Режим: {{ isEditMode ? 'редактирование' : 'просмотр' }}</button>
    <div v-if="isEditMode" class="controls__buttons">
      <button
        :disabled="isUndoDisabled"
        class="controls__button_undo button_icon"
        @click="onUndo"
      >
        <MsIcon class="ms-icon" icon="arrow-undo"></MsIcon>
      </button>
      <button
        :disabled="isRedoDisabled"
        class="controls__button_redo button_icon"
        @click="onRedo"
      >
        <MsIcon class="ms-icon" icon="arrow-redo"></MsIcon>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .controls {
    display: flex;
    gap: 8px 0;
    height: 30px;

    .button_transparent,
    .button_icon {
      background-color: transparent;
      border: lightgreen;
      color: dodgerblue;
      cursor: pointer;
    }

    .button_icon:disabled {
      opacity: 0.5;
    }
  }

  :deep(.ms-icon) {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }
</style>