import type { TNodeId, TTreeItem } from "@/components/MSTree/types"

export default class TreeStore {
  /** Оригинальный массив */
  private readonly treeData: TTreeItem[] = []
  /** Рабочий массив */
  readonly tree: TTreeItem[] = []

  /**
   * Заглушка для генерации id,
   * которая явно не будет работать с uuid :)
   */
  private currentId: number = 0

  constructor(data: TTreeItem[]) {
    let maxId = 0

    this.treeData = data
    const children = new Map<TNodeId, TNodeId[]>()

    for (const item of this.treeData) {
      this.addItem({ ...item, children: [] })

      if (!item.parent) continue

      // Запоминаем id детей для дальнейшего добавления
      const directChild = children.get(item.parent)
      if (!directChild)
        children.set(item.parent, [item.id])
      else
        directChild.push(item.id)

      const isIdNaN = isNaN(+item.id)
      if (isIdNaN) maxId = 1_000_000_000_000
      else if (maxId <= +item.id) maxId = +item.id + 1
    }

    // Заполняем currentId для генерации id при добавлении элемента
    this.currentId = maxId

    // Заполняем children у элементов
    for (const id of children.keys()) {
      const item = this.getItem(id) as TTreeItem
      this.updateItem({
        ...item,
        children: !!children.get(id)
          ? children.get(id)
          : []
      })
    }
  }

  private generateId() {
    return this.currentId++
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
    return this.tree.find(item => item.id === id)
  }

  /**
   * Получить позицию элемента в массиве
   * @param id
   * @private
   */
  private getItemIndex(id: TNodeId) {
    return this.tree.findIndex((item) => item.id === id)
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
    const allChildren: TTreeItem[] = []

    const findChildren = (nodeId: TNodeId) => {
      const node = this.getItem(nodeId);
      if (!node) return []
      if (!node.children?.length) return [node]

      // Получаем все дочерние узлы
      const children = this.getChildren(nodeId)
      if (children?.length) {
        allChildren.push(...children)
        // Рекурсивно ищем дочерние узлы для каждого дочернего узла
        children.forEach(child => findChildren(child?.id))
      }
    }

    findChildren(id)
    return allChildren
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
   * Добавить новый элемент
   * @param item
   */
  addItem(item: Partial<TTreeItem>) {
    if (!item) throw new Error('item должен соответствовать типу')

    const itemHasId = item.id != null

    if (itemHasId) {
      this.tree.push(item)
      // Добавляем новый элемент в children у родителя
      if (item.parent) {
        const parent = this.getItem(item.parent)
        parent?.children?.push(item.id)
      }

      return item
    } else {
      const id = this.generateId()
      this.tree.push({ ...item, label: `Новый айтем ${id}`, id })
      // Добавляем новый элемент в children у родителя
      if (item.parent) {
        const parent = this.getItem(item.parent)
        parent?.children?.push(id)
      }

      return { ...item, label: `Новый айтем ${id}`, id }
    }
  }

  /**
   * Убрать элемент и все его дочерние элементы
   * @param id
   */
  removeItem(id: TNodeId) {
    if (typeof id !== 'string' && typeof id !== 'number')
      throw new Error('id должен быть числом или строкой')

    const item = this.getItem(id)
    if (!item) return

    if (item?.children?.length) {
      const children = this.getAllChildren(item.id)
      children.forEach((i) => this.removeItem(i.id))
    }

    const index = this.getItemIndex(id)
    this.tree.splice((index),1)
  }

  /**
   * Обновить объект в массиве
   * @param item
   */
  updateItem(item: TTreeItem) {
    console.warn('item', item)
    if (!item) throw new Error('item должен соответствовать типу')
    else if (!item.id) {
      throw new Error('id у item должен быть числом или строкой')
    }

    const index = this.getItemIndex(item.id)
    this.tree[index] = item
  }
}
