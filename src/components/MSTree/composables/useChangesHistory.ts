import type { Ref } from "vue"
import type { THistoryChangeItem } from "@/components/MSTree/types/changeHistory.ts"
import type TreeStore from "@/components/MSTree/composables/TreeStore.ts"
import { ref } from "vue"
import { ETreeAction } from "@/components/MSTree/types/changeHistory.ts"

export default (treeStore: Ref<TreeStore>) => {
  const changesHistory = ref<THistoryChangeItem[]>([])
  let currentChangeIndex = ref(-1)

  /**
   * Записать изменение в историю
   * @param change
   */
  const storeChange = (change: THistoryChangeItem) => {
    // Удаляем все изменения, если мы не на самом конце истории
    if (currentChangeIndex.value < changesHistory.value.length - 1) {
      changesHistory.value = changesHistory.value.slice(0, currentChangeIndex.value + 1)
    }

    changesHistory.value.push(change)
    currentChangeIndex.value++
  }

  /** Отменить изменение */
  const revertChange = () => {
    if (currentChangeIndex.value < 0) return

    const change = changesHistory.value[currentChangeIndex.value];

    switch (change.action) {
      case ETreeAction.ADD:
        treeStore.value.removeItem(change.newItem.id)
        break
      case ETreeAction.REMOVE:
        treeStore.value.addItem(change.oldItem)
        if (change?.deletedChildren)
          change.deletedChildren.forEach((i) => treeStore.value.addItem(i))
        break
      case ETreeAction.UPDATE:
        treeStore.value.updateItem(change.oldItem)
        break
    }

    currentChangeIndex.value--
  }

  /** Вернуть (применить) изменение */
  const applyChange = () => {
    if (currentChangeIndex.value >= changesHistory.value.length - 1) return; // Нет изменений для возврата

    currentChangeIndex.value++;
    const change = changesHistory.value[currentChangeIndex.value]

    switch (change.action) {
      case ETreeAction.ADD:
        treeStore.value.addItem(change.newItem)
        break
      case ETreeAction.REMOVE:
        treeStore.value.removeItem(change.oldItem.id)
        break
      case ETreeAction.UPDATE:
        treeStore.value.updateItem(change.newItem)
        break
    }
  }

  return {
    changesHistory,
    currentChangeIndex,
    storeChange,
    revertChange,
    applyChange,
  }
}

