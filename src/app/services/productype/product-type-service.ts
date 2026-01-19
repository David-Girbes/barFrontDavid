import { Injectable } from '@angular/core';
import * as DataProductType from './productType.json';
import { ProductType } from '@barassistantshared/entities';
@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private data: ProductType[] = (DataProductType as any).default as ProductType[];
  getData(): ProductType[] {
    console.log(this.data);
    return this.data;
  }
}

