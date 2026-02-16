import { Component, inject, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Tree, TreeNodeSelectEvent } from "primeng/tree";
import { firstValueFrom } from 'rxjs';
import { CategoryTypeService } from '../../services/categorytype/category-type-service';
import { Category, CategoryType, Product, ProductType } from '@barassistantshared/entities';
import { TableModule } from "primeng/table";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { CategoryService } from '../../services/category/category-service';
import { Button } from "primeng/button";
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-manage-products-bar',
  imports: [Tree, TableModule, IconField, InputIcon, Button],
  templateUrl: './manage-products-bar.html',
  styleUrl: './manage-products-bar.css',
})
export class ManageProductsBar {

  private categoryService = inject(CategoryService)
  private categoryTypeService = inject(CategoryTypeService)
  private productService = inject(ProductService)  

  //Primeras tablas
  value1 = signal<TreeNode[]>([]);
  selectedCategoryType: TreeNode | null = null;
  categoriesType:CategoryType[] = []
  productsType:ProductType[] = []
  selectedProductType:ProductType;
  enterpriseId = 1

  //Segundas tablas

  value2 = signal<TreeNode[]>([])

  selectedCategory:TreeNode | null = null
  selectedProduct:Product;

  products:Product[] = []
  categories:Category[] = []

  //Botones------------------------------------------------------------------------------

  deleteProduct(){
    if(!this.selectedProduct){
      alert("You must select a product")
      return
    }
    
    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: (response)=>{
        alert("Product deleted successfully")
        this.loadProducts()
        this.selectedProduct = null as any
      },
      error:(error)=>{
        console.error("Error deleting product:", error)
        alert("Error deleting product")
      }
    })
  }


  deleteCategory(){
    if(!this.selectedCategory){
      alert("You must select a category")
      return
    }

    let totalProducts = 0;
    let totalCategories = 0;

    const deleteCategoryRecursively = (categoryId: number): Promise<void> => {
      return firstValueFrom(this.categoryService.getProductsByCategory(categoryId)).then((products: Product[]) => {
        const deleteProductPromises = products.map(product => {
          totalProducts++;
          return firstValueFrom(this.productService.deleteProduct(product.id));
        });

        return Promise.all(deleteProductPromises).then(() => {
          return firstValueFrom(this.categoryService.getCategory()).then((categories: Category[]) => {
            const findCategory = (cats: Category[], id: number): Category | null => {
              for (const cat of cats) {
                if (cat.id === id) return cat;
                if (cat.subcategories && cat.subcategories.length > 0) {
                  const found = findCategory(cat.subcategories, id);
                  if (found) return found;
                }
              }
              return null;
            };

            const currentCategory = findCategory(categories, categoryId);

            if (currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0) {
              const deleteSubcategoryPromises = currentCategory.subcategories.map(subcat => 
                deleteCategoryRecursively(subcat.id)
              );
              return Promise.all(deleteSubcategoryPromises).then(() => {
                totalCategories++;
                return firstValueFrom(this.categoryService.deleteCategory(categoryId)).then(() => undefined);
              });
            } else {
              totalCategories++;
              return firstValueFrom(this.categoryService.deleteCategory(categoryId)).then(() => undefined);
            }
          });
        });
      });
    };

    // Iniciar el proceso recursivo
    deleteCategoryRecursively(this.selectedCategory.data.id)
      .then(() => {
        alert(`${totalCategories} categories and ${totalProducts} products deleted successfully!`)
        this.loadCategories()
        this.selectedCategory = null
        this.products = []
      })
      .catch(error => {
        console.error("Error deleting category recursively:", error)
        alert("Error deleting category and subcategories")
        this.loadCategories()
      })
  }


  moveProduct(){
    if(!this.selectedProductType){
      alert("You must select a productType")
      return
    }

    if(!this.selectedCategory){
      alert("You must select a category to add the product to")
      return
    }

    const newProduct: Partial<Product> = {
      name: this.selectedProductType.name,
      description: this.selectedProductType.description,
      sellPrice: this.selectedProductType.sellPrice,
      image: this.selectedProductType.image,
      quantity: this.selectedProductType.quantity,
      enterprise: { id: this.enterpriseId } as any,
      categories: [this.selectedCategory.data]
    }

    this.productService.saveProduct(newProduct as Product).subscribe({
      next: (productResponse: any) => {
        alert('Product added successfully!')
        this.loadProducts()
        this.removeProductTypeFromView()
      },
      error: (error) => {
        console.error("Error creating product:", error)
        alert("Error creating product")
      }
    })
  }

  removeProductTypeFromView(): void {
    if (this.selectedProductType) {
      const productTypeId = this.selectedProductType.id;
      
      this.productsType = this.productsType.filter(pt => pt.id !== productTypeId);
      
      this.selectedProductType = null as any;
    }
  }


  moveCategory(){
    if(!this.selectedCategoryType){
      alert("You must select a categoryType")
      return
    }

    const processCategoryRecursively = (categoryType: CategoryType, parentCategory: Category | null): Promise<Category> => {
      const newCategory: Partial<Category> = {
        name: categoryType.name,
        description: categoryType.description,
        image: categoryType.image,
        parentCategory: parentCategory,
        subcategories: [],
        products: [],
        enterprise: { id: this.enterpriseId } as any
      }

      return firstValueFrom(this.categoryService.saveCategory(newCategory as Category)).then((categoryResponse: any) => {
        const savedCategory = categoryResponse.object

        return firstValueFrom(this.categoryTypeService.getProductsByCategory(categoryType.id)).then((productsType: ProductType[]) => {
          const productPromises = productsType.map(productType => {
            const newProduct: Partial<Product> = {
              name: productType.name,
              description: productType.description,
              sellPrice: productType.sellPrice,
              image: productType.image,
              quantity: productType.quantity,
              enterprise: { id: this.enterpriseId } as any,
              categories: [savedCategory]
            }
            return firstValueFrom(this.productService.saveProduct(newProduct as Product))
          })

          return Promise.all(productPromises).then(() => {
            if (categoryType.subcategoriesType && categoryType.subcategoriesType.length > 0) {
              const subcategoryPromises = categoryType.subcategoriesType.map(subCategoryType => 
                processCategoryRecursively(subCategoryType, savedCategory)
              )
              return Promise.all(subcategoryPromises).then(() => savedCategory)
            }
            return savedCategory
          })
        })
      })
    }

    const processWithParent = (): Promise<void> => {
      const selectedCategory = this.selectedCategoryType!.data;
      
      if (selectedCategory.parentCategoryType) {
        return firstValueFrom(this.categoryService.getCategory()).then((categories: Category[]) => {
          const findCategoryByName = (cats: Category[], name: string): Category | null => {
            for (const cat of cats) {
              if (cat.name === name) return cat;
              if (cat.subcategories && cat.subcategories.length > 0) {
                const found = findCategoryByName(cat.subcategories, name);
                if (found) return found;
              }
            }
            return null;
          };

          const existingParent = findCategoryByName(categories, selectedCategory.parentCategoryType.name);

          if (existingParent) {
            return processCategoryRecursively(selectedCategory, existingParent).then(() => {
              this.removeCategoryTypeFromView();
            });
          } else {
            return processCategoryRecursively(selectedCategory.parentCategoryType, null).then((parentCreated) => {
              return processCategoryRecursively(selectedCategory, parentCreated).then(() => {
                this.removeCategoryTypeFromView();
              });
            });
          }
        });
      } else {
        return processCategoryRecursively(selectedCategory, null).then(() => {
          this.removeCategoryTypeFromView();
        });
      }
    };

    processWithParent()
      .then(() => {
        alert('Category, subcategories and products moved successfully!')
        this.loadCategories()
      })
      .catch(error => {
        console.error("Error moving category:", error)
        alert("Error moving category")
        this.loadCategories()
        this.removeCategoryTypeFromView()
      })
  }

  removeCategoryTypeFromView(): void {
    if (this.selectedCategoryType) {
      const categoryTypeId = this.selectedCategoryType.data.id;
      
      console.log('Intentando eliminar categoría con ID:', categoryTypeId);
      console.log('Categorías antes:', this.categoriesType);
      
      // Función recursiva para eliminar la categoría del árbol
      const removeFromTree = (categories: CategoryType[]): CategoryType[] => {
        const result: CategoryType[] = [];
        
        for (const cat of categories) {
          if (cat.id === categoryTypeId) {
            console.log('Categoría encontrada y eliminada:', cat.name);
            continue; 
          }
          
          if (cat.subcategoriesType && cat.subcategoriesType.length > 0) {
            cat.subcategoriesType = removeFromTree(cat.subcategoriesType);
          }
          
          result.push(cat);
        }
        
        return result;
      };
      
      this.categoriesType = removeFromTree(this.categoriesType);
      
      console.log('Categorías después:', this.categoriesType);
      
      this.value1.set(this.categoryTypeService.transformRecursivelyToListTreeNode(this.categoriesType));
      
      // Limpiar selección y productos
      this.selectedCategoryType = null;
      this.productsType = [];
    }
  }


//Métodos de carga-------------------------------------------------------------------


  ngOnInit(): void {
    this.loadCategoriesType()
    this.loadCategories()
  }

  loadCategories():void{
    this.categoryService.getCategory().subscribe({
      next:(categories)=>{
        this.categories = categories
        this.value2.set(this.categoryService.transformRecursivelyToListTreeNodeCat(this.categories))
      }
    })
  }

  loadCategoriesType(): void {
    this.categoryTypeService.getCategoryType().subscribe({
      next:(categories)=>{
        this.categoriesType = categories
        this.value1.set(this.categoryTypeService.transformRecursivelyToListTreeNode(this.categoriesType))
      }
    })
  }

  loadProducts(): void {
    if(this.selectedCategory?.data?.id) {
      this.categoryService.getProductsByCategory(this.selectedCategory.data.id).subscribe({
        next:(products: Product[]) => {
          this.products = products
        }
      })
    }
  }

  loadProductsType(): void {
    if(this.selectedCategoryType?.data?.id) {
      this.categoryTypeService.getProductsByCategory(this.selectedCategoryType.data.id).subscribe({
        next:(products: ProductType[]) => {
          this.productsType = products
        }
      })
    }
  }
 


onNodeSelect($event: TreeNodeSelectEvent) {
  this.selectedCategoryType = $event.node;
  this.loadProductsType()
}

onNodeSelectBar($event: TreeNodeSelectEvent) {
  this.selectedCategory = $event.node;
  this.loadProducts()
}



}
