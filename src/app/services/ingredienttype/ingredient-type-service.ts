
import { Injectable } from '@angular/core';
import * as DataIngredientType from './IngredientType.json';
import { IngredientType } from '@barassistantshared/entities';
@Injectable({
  providedIn: 'root'
})
export class IngredientTypeService {
  private data: IngredientType[] = (DataIngredientType as any).default as IngredientType[];
  getData(): IngredientType[] {
    console.log(this.data);
    return this.data;
  }
}
