import { TreeNode } from 'primeng/api';
export class BarTreeNode<T> implements TreeNode<T> {
  label?: string;
  data?: T;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: BarTreeNode<T>[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: BarTreeNode<T>;
  partialSelected?: boolean;
  style?: any;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;

  isLeafNode(): boolean {
    return this.children === undefined || this.children.length === 0;
  }
}
