export type TNodeId = number | string

export type TTreeItem = {
  id: TNodeId
  parent: TNodeId | null
  label: string

  children?: TNodeId[]
}
