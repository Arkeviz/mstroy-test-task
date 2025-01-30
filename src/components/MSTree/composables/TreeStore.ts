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

      if (item.parent == null) {
        item.positionIndex = this.tree.length
        this.addItem({ ...item, children: [] })
        continue
      }

      this.addItem({ ...item, children: [] })

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

    for (const node of this.tree) {
      const positionIndex =
        node.parent == null
          ? this.getItemIndex(node.id)
          : this.getChildren(node.parent)?.findIndex((i) => i?.id == node.id)

      this.updateItem({
        ...node,
        positionIndex,
        children: !!children.get(node.id)
          ? children.get(node.id)
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
  getItem(id: TNodeId | null): TTreeItem | undefined {
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
   * Добавляет элемент в `tree`.
   * Если есть родитель - также добавляет в `children`.
   * При добавлении сохраняет позицию (если такова имелась)
   * @param item
   * @param parent
   * @private
   */
  private addItemWithPosition(item: TTreeItem, parent: TTreeItem | undefined) {
    const itemHasParent = !!this.getItem(item.parent)

    if (itemHasParent) {
      if (item.positionIndex >= (parent?.children?.length ?? 0))
        parent?.children?.push(item.id)
      else
        parent?.children?.splice(item.positionIndex, 0, item.id)

      this.tree.push(item)

      return
    }

    if (item.positionIndex >= this.tree.length)
      this.tree.push(item)
    else
      this.tree.splice(item.positionIndex, 0, item)
  }

  /**
   * Добавить элемент
   * @param item
   */
  addItem(item: TTreeItem) {
    if (!item) throw new Error('item должен соответствовать типу')

    const parent = this.getItem(item.parent)
    const itemHasId = item.id != null

    if (itemHasId) {
      this.addItemWithPosition(item, parent)

      return item
    } else {
      const id = this.generateId()
      const newItem = { ...item, label: `Новый айтем ${id}`, id }

      this.addItemWithPosition(newItem, parent)

      return newItem
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

    // Удаляем элемент из children родителя
    if (item.parent) {
      const parent = this.getItem(item.parent)
      if (parent && parent.children) {
        parent.children = parent.children.filter(childId => childId !== id)
      }
    }

    // Удаляем все дочерние элементы
    if (item.children?.length) {
      const children = this.getAllChildren(item.id)
      children.forEach((child) => this.removeItem(child.id))
    }

    // Удаляем элемент из основного массива
    const index = this.getItemIndex(id)
    this.tree.splice(index, 1)
  }

  /**
   * Обновить объект в массиве
   * @param item
   */
  updateItem(item: TTreeItem) {
    if (!item) throw new Error('item должен соответствовать типу')
    else if (!item.id) {
      throw new Error('id у item должен быть числом или строкой')
    }

    const index = this.getItemIndex(item.id)
    this.tree[index] = item
  }
}
