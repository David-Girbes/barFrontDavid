import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { Component, effect, input, model, output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button'
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { Select } from '../Base/select/select';
import { ProductTypeService } from '../../services/productype/product-type-service';
import { PickTable } from '../Base/pick-table/pick-table';
import { TreeNode } from 'primeng/api';
import { CategoryTypeService } from '../../services/categorytype/category-type-service';
import { CategoryType, ProductType } from '@barassistantshared/entities';


@Component({
  selector: 'app-product-list',
  imports: [FormsModule, TableModule, ButtonModule, SelectModule, PickTable],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  categoriesTree = signal<TreeNode<CategoryType>[]>([]);
  clickedRow: number = -1;
  selectedProductType: ProductType;
  productCategoriesTree = model<TreeNode<CategoryType>[]>([]);
  tableProductsType: ProductType[] = [];
  productAdded = output<ProductType>();
  //selectableProducts: ProductType[] = [];
  //onItemSelected(event: Event) {
  //alert(event.name);
  //}
  constructor(private productTypeService: ProductTypeService,
    private categoryTypeService: CategoryTypeService) {
    this.tableProductsType = this.productTypeService.getData();
    const val = this.categoryTypeService.getData();
    this.categoriesTree.set(categoryTypeService.transformRecursivelyToListTreeNode(val));
    if (this.tableProductsType && this.tableProductsType.length > 0) {
      this.selectedProductType = this.tableProductsType[0];
    }
    else {
      this.selectedProductType = {} as ProductType;
    }
    this.productCategoriesTree.set(this.categoryTypeService.transformRecursivelyToListTreeNode(this.selectedProductType.categoriesType));
    effect(() => {
      console.log('productCategoriesTree');
      console.log(this.productCategoriesTree());
      this.selectedProductType.categoriesType = this.categoryTypeService.transformToList(this.productCategoriesTree());
    })
  }
  reactToProductTypeChange($event: TableRowSelectEvent<ProductType>) {
    console.log('reactToProductTypeChange');
    console.log($event);
    this.productCategoriesTree.set(this.categoryTypeService.transformRecursivelyToListTreeNode(this.selectedProductType.categoriesType));

  }

}
