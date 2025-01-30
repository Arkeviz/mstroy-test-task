export type TNodeId = number | string

export type TTreeItem = {
  id: TNodeId
  parent: TNodeId | null
  label: string
  /** Споисок индексов дочерних элементов */
  children: TNodeId[]
  /** Номер позиции дочернего узла в `children` родителя */
  positionIndex: number
  /** Индекс элемента в дереве */
  treeIndex?: number
  /** Иерархия для построения дерева в компоненте AG Grid*/
  path?: number[]
}
