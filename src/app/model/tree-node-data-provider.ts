import { TreeNode } from "primeng/api";

export interface TreeNodeDataProvider<T> {
  getData(): T[];
  //transforma un item de tipus T a un TreeNode que conté un objecte de tipus T
  transformToTreeNode(item: T): TreeNode<T>;
  //transforma les dades
  transformRecursivelyToListTreeNode(data: T[]): TreeNode<T>[];
}
