<script setup lang="ts">
  import { inject } from "vue"
  import { IsEditModeKey } from "@/constants"
  import MsIcon from "@/components/icons/MsIcon.vue"

  const emits = defineEmits<{
    redoChange: []
    undoChange: []
  }>()

  const { isEditMode, toggleMode } = inject(IsEditModeKey)

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
      <button @click="onUndo" class="controls__button_undo button_icon">
        <MsIcon class="ms-icon" icon="arrow-undo"></MsIcon>
      </button>
      <button @click="onRedo" class="controls__button_redo button_icon">
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
  }

  :deep(.ms-icon) {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }
</style>