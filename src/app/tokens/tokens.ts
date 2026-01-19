// src/app/tokens/tokens.ts

import { InjectionToken } from '@angular/core';
import { TreeNodeDataProvider } from '../model/tree-node-data-provider';
import { CategoryType } from '../model/ItemFlattened';

export const CATEGORY_PROVIDER = new InjectionToken<TreeNodeDataProvider<CategoryType>>(
  'Token per al proveïdor de dades de categories'
);
