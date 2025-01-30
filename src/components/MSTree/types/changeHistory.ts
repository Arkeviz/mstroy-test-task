import type { TTreeItem } from "@/components/MSTree/types/index.ts"

export enum ETreeAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update'
}

export type THistoryChangeItem = {
  /** Действие */
  action: ETreeAction
  /** Новое значение элемента */
  newItem?: TTreeItem
  /** Старое значение элемента */
  oldItem?: TTreeItem
  /** Храним детей удалённого элемента */
  deletedChildren?: TTreeItem[]
}