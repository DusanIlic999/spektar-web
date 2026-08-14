// utils/buildCommentTree.ts

type Treeable = {
  id: string;
  createdAt: string;
  parent?: { id: string } | null;
};

export type WithChildren<T> = T & { children: WithChildren<T>[] };

export function buildCommentTree<T extends Treeable>(
  items: T[],
): WithChildren<T>[] {
  const byId = new Map<string, WithChildren<T>>();
  for (const item of items) {
    byId.set(item.id, { ...item, children: [] });
  }

  const roots: WithChildren<T>[] = [];
  for (const item of items) {
    const node = byId.get(item.id)!;
    const parent = item.parent ? byId.get(item.parent.id) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortRec = (nodes: WithChildren<T>[]) => {
    nodes.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}
