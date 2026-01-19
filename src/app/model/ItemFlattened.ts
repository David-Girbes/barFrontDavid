
export interface ItemFlattened {
  id: number;
  label: string;
  isLeaf: boolean;
  level: number; // 0 per a l'arrel, 1 per a fills, etc.

}
