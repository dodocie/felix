//1. 数组转为tree
interface TreeNode {
  id: string
  parentId: string
  name: string
  children?: TreeNode[]
}
/**
 * @param arr TreeNode[]
 */
function buildTreeViaMap(nodes: TreeNode[]) {
  const map: { [id: string]: TreeNode } = {}
  const tree: TreeNode[] = []

  for (const node of nodes) {
    node.children = []
    map[node.id] = node
  }

  for (const node of nodes) {
    const parent = map[node.parentId]
    if (parent) {
      parent.children?.push(node)
    } else {
      tree.push(node)
    }
  }
}

/**
 * @param arr TreeNode[]
 * @param parentId string | undefined
 */
function buildTree(nodes: TreeNode[], parentId?: string) {
  const tree: TreeNode[] = []
  for (const node of nodes) {
    if (node.parentId === parentId) {
      const children = buildTree(nodes, parentId)
      children.length && (node.children = children)
    }
    tree.push(node)
  }

  return tree
}

const data = [
  { id: '1', name: 'Node 1' },
  { id: '2', parentId: '1', name: 'Node 1.1' },
  { id: '3', parentId: '1', name: 'Node 1.2' },
  { id: '4', parentId: '2', name: 'Node 1.1.1' },
  { id: '5', parentId: '2', name: 'Node 1.1.2' },
  { id: '6', name: 'Node 2' },
  { id: '7', parentId: '6', name: 'Node 2.1' },
  { id: '8', parentId: '6', name: 'Node 2.2' },
]
