export type TNodeId = number | string

export type TTreeItem = {
  id: TNodeId
  parent: TNodeId | null
  label: string
  /** Индекс элемента в дереве */
  treeIndex?: number
  /** Споисок индексов дочерних элементов */
  children?: TNodeId[]
  /** Иерархия для построения дерева в компоненте AG Grid*/
  path?: number[]
}
