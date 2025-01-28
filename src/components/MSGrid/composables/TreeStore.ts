import type { TNodeId, TTreeItem } from "@/components/MSGrid/types"

export default class TreeStore {
  /** Оригинальный массив */
  readonly treeData: TTreeItem[] = []
  /** Дерево (Map) */
  readonly tree = new Map<TNodeId, TTreeItem>()

  constructor(data: TTreeItem[]) {
    this.treeData = data
    const children: { [i: TNodeId]: number[] } = {}

    for (const item of this.treeData) {
      this.addItem({ ...item, id: +item.id, children: [] })

      if (!item.parent) continue

      // Запоминаем id детей для дальнейшего добавления
      if (!children[+item.parent]) {
        children[+item.parent] = [+item.id]
      } else {
        children[+item.parent].push(+item.id)
      }
    }

    // Заполняем children у элементов
    for (const id of Object.keys(children)) {
      const item = this.getItem(+id) as TTreeItem
      // this.tree.set(+id, { ...item, children: children[+id] })
      console.warn(id, item)
      this.updateItem({ ...item, children: children[+id] })
    }
  }

  /**
   * Получить оригинальный массив
   */
  getAll() {
    return this.treeData
  }

  /**
   * Получить элемент дерева
   * @param id
   */
  getItem(id: TNodeId): TTreeItem | undefined {
    return this.tree.get(+id)
  }

  /**
   * Получить массив дочерних элементов дерева
   * @param id
   */
  getChildren(id: TNodeId) {
    const node = this.getItem(id)
    if (!node) return

    if (!node?.children?.length) return []

    return node.children.map((id) => this.getItem(id))
  }

  /**
   * Получить массив ВСЕХ дочерних элементов
   * @param id
   */
  getAllChildren(id: TNodeId): TTreeItem[] {
    const children: TTreeItem[] = []

    const findChildren = (nodeId: TNodeId) => {
      const node = this.getItem(nodeId);
      if (!node) return []
      if (!node.children?.length) return [node]

      // Получаем все дочерние узлы
      const directChildren = this.getChildren(nodeId)
      if (directChildren?.length) {
        children.push(...directChildren)
        // Рекурсивно ищем дочерние узлы для каждого дочернего узла
        directChildren.forEach(child => findChildren(child?.id))
      }
    }

    findChildren(id)
    return children
  }

  /**
   * Найти всех родителей элемента
   * @param id
   */
  getAllParents(id: TNodeId) {
    const parents: TTreeItem[] = [];
    let currentId: TNodeId | null = id

    while (currentId !== null) {
      const node = this.getItem(currentId)
      if (!node) break

      parents.push(node)
      currentId = node.parent
    }

    return parents
  }

  /**
   * Добавить новый элемент в дерево
   * @param item
   */
  addItem(item: TTreeItem) {
    if (!item) throw new Error('item должен соответствовать типу')
    else if (!item.id)
      throw new Error('id у item должен быть числом или строкой')

    this.tree.set(item.id, item)

    // Добавляем новый элемент в children у родителя
    if (item.parent) {
      this.getItem(item.parent)?.children?.push(item.id)
    }
  }

  /**
   * Убрать элемент и все его дочерние элементы из дерева
   * @param id
   */
  removeItem(id: TNodeId) {
    if (!id) throw new Error('id должен быть числом или строкой')

    const item = this.getItem(id)
    if (!item) throw new Error(`Объекта с id=${id} не существует`)

    if (item?.children?.length) {
      const children = this.getAllChildren(item.id)
      children.forEach((i) => this.removeItem(i.id))
    }

    this.tree.delete(id)
  }

  /**
   * Обновить объект в дереве
   * @param item
   */
  updateItem(item: TTreeItem) {
    if (!item) throw new Error('item должен соответствовать типу')
    else if (!item.id)
      throw new Error('id у item должен быть числом или строкой')

    this.tree.set(item.id, item)
  }
}