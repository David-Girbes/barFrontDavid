import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { Tree } from "primeng/tree";

import { TreeNode, TreeDragDropService } from 'primeng/api';
import { CategoryType } from '../../../../../barassistantshared/src/entity/CategoryType';
import { CategoryTypeService } from '../../services/categorytype/category-type-service';
import { ProductType } from '@barassistantshared/entities';

@Component({
  selector: 'app-category-type-management',
  imports: [Button, Dialog, Tree, FormsModule],
  providers: [TreeDragDropService],
  templateUrl: './category-type-management.html',
  styleUrl: './category-type-management.css'
})
export class CategoryTypeManagement {

  private categoryTypeService = inject(CategoryTypeService)

  ngOnInit():void{
    this.loadCategoryType()
  }

  value1 = signal<TreeNode[]>([]);

  categoriesType: CategoryType[] = []
  isEditing: boolean = false;
  visible: boolean = false;
  tempCat: CategoryType = { name: '', description: '', image: '' } as CategoryType;
  selectedNode: TreeNode<CategoryType> | null = null;
 
  //Cargar las categorias desde la API
  loadCategoryType():void{
    this.categoryTypeService.getCategoryType().subscribe({
      next: (categrories) => {
        this.categoriesType = categrories
        this.value1.set(this.categoryTypeService.transformRecursivelyToListTreeNode(this.categoriesType))
      }
    })
  }
  
  //Mostrar el dialogo
  showDialog(numero:any) {
    if(numero===1){
      // Agregar nueva categoría
      this.visible = true;
      this.isEditing = false;
      this.tempCat = { name: '', description: '', image: '', parentCategoryType:null } as CategoryType;
    }else if(numero===2){
      // Modificar categoría existente
      if(this.selectedNode === null){
        alert("You must select a category")
        return
      }
      this.visible = true;
      this.isEditing = true;
      const parent = this.selectedNode.data?.parentCategoryType as CategoryType
      this.tempCat = {
        id: this.selectedNode.data?.id,
        name: this.selectedNode.data?.name || '',
        description: this.selectedNode.data?.description || '',
        image: this.selectedNode.data?.image || '',
        parentCategoryType: parent || null,
        subcategoriesType: this.selectedNode.data?.subcategoriesType || []
      } as CategoryType;
    }
    console.log(this.tempCat)
    console.log(parent)
  }

  //Cerrar e dialogo
  closeDialog() {
    this.visible = false;
    this.tempCat = { name: '', description: '', image: '',parentCategoryType:null } as CategoryType;
  }

//MODIFICAR UNA CATEGORÍA------------------------------------------------------
  modify(){
    if(this.isEditing){

      const categoryToModify: Partial<CategoryType> = {
        id: this.tempCat.id,
        name: this.tempCat.name,
        description: this.tempCat.description,
        image: this.tempCat.image,
        parentCategoryType: this.tempCat.parentCategoryType
      }
      
      this.categoryTypeService.saveCategory(categoryToModify).subscribe({
        next:(response) => {
          alert("Category modified successfully")
          this.loadCategoryType()
          this.closeDialog()
        },
        error:(err) => {
          alert("error modding category")
          console.error(err)
        }
      })
    }
  }

//AGREGAR UNA CATEGORÍA-------------------------------------------------
  addCategory(){
    if (!this.tempCat.name.trim()) {
      alert('Name is required');
      return;
    }

      const parentId = this.selectedNode?.data?.id ?? null
      const categoryToSave: Partial<CategoryType> = {
        name: this.tempCat.name,
        description: this.tempCat.description,
        image: this.tempCat.image,
        parentCategoryType: parentId ? { id: parentId } as CategoryType : null,
        subcategoriesType:[]
      }
      
      this.categoryTypeService.saveCategory(categoryToSave).subscribe({
        next:(response) => {
          alert("Category saved successfully")
          this.loadCategoryType()
          this.closeDialog()
        },
        error:(err) => {
          alert("error saving category")
          console.error(err)
        }
      })
    
  }
  
  //BORRAR UNA CATEGORÍA----------------------------------------------------
  delete(){

    if(this.selectedNode==null){
      alert("You must select a category")
    }else{
      this.categoryTypeService.deleteCategory(this.selectedNode.data?.id).subscribe({
        next: (response) => {
          alert("Category deleted successfully")
          this.loadCategoryType()
        },
        error: (err) => {
          console.log("Error deleting category", err)
          alert("Error deleting category")
        }
      })
    }

  }


  // onNodeSelect(event: any) {
  //   this.selectedNode = event.node.data;
  // }

  onNodeDrop(event: any) {
    console.log('onNodeDrop event:', event);
    
    const dragNode = event.dragNode as TreeNode<CategoryType>;
    const dropNode = event.dropNode as TreeNode<CategoryType>;
    const dropIndex = event.dropIndex;
    
    console.log('dragNode:', dragNode?.data);
    console.log('dropNode:', dropNode?.data);
    console.log('dropIndex:', dropIndex);
    console.log('dropNode?.parent:', dropNode?.parent);
    console.log('dragNode?.parent:', dragNode?.parent);
    
    const draggedCategoryId = dragNode?.data?.id;
    
    if (!draggedCategoryId) {
      console.error('No se pudo obtener el ID de la categoría arrastrada');
      return;
    }
    
    // Determinar el nuevo padre
    let newParentId = null;
    
    if (!dropNode) {
      // No hay nodo de destino → raíz
      newParentId = null;
      console.log('Movido a la RAÍZ (sin dropNode)');
    } else if (dropIndex >= 0) {
      // dropIndex >= 0 → Se soltó JUNTO al nodo (como hermano)
      if (dropNode.parent && dropNode.parent.data) {
        newParentId = dropNode.parent.data.id;
        console.log('Soltado JUNTO al nodo:', dropNode.data?.name, 'con padre:', dropNode.parent.data.name);
      } else {
        // Hermano en la raíz
        newParentId = null;
        console.log('Movido a la RAÍZ (hermano de nodo raíz)');
      }
    } else if (dropIndex === undefined && !dropNode.parent && dragNode.parent) {
      // Arrastrar un hijo y soltar sobre nodo raíz → sacar a raíz
      newParentId = null;
      console.log('Sacado a la RAÍZ (hijo sobre nodo raíz)');
    } else if (dropIndex === -1 || (dropIndex === undefined && dropNode.expanded)) {
      // dropIndex = -1 O (undefined y nodo expandido) → DENTRO del nodo (como hijo)
      newParentId = dropNode.data?.id || null;
      console.log('Soltado DENTRO del nodo:', dropNode.data?.name);
    } else {
      // Caso por defecto: dentro del nodo
      newParentId = dropNode.data?.id || null;
      console.log('Soltado DENTRO del nodo (caso por defecto):', dropNode.data?.name);
    }
    
    console.log('newParentId final:', newParentId);
    
    // Actualizar el padre de la categoría arrastrada
    const categoryToUpdate: Partial<CategoryType> = {
      id: draggedCategoryId,
      name: dragNode.data!.name,
      description: dragNode.data!.description,
      image: dragNode.data!.image,
      parentCategoryType: newParentId ? { id: newParentId } as CategoryType : null
    };
    
    this.categoryTypeService.saveCategory(categoryToUpdate).subscribe({
      next: (response) => {
        console.log('Categoría movida exitosamente');
        this.loadCategoryType();
      },
      error: (err) => {
        console.error('Error moviendo categoría', err);
        alert('Error al mover la categoría');
        this.loadCategoryType(); // Recargar para revertir el cambio visual
      }
    });
  }
}
