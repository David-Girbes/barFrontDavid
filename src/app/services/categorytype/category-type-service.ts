import { inject, Injectable } from '@angular/core';
import { ItemFlattened } from '../../model/ItemFlattened';
import { TreeNode } from 'primeng/api';
import { CategoryType } from '@barassistantshared/entities';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../../model/apiResult';

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService {

  private http = inject(HttpClient)

  //Coger las categorias
  getCategoryType():Observable<CategoryType[]>{
    const url = environment.apiUrl + "/categoryTypes"
    console.log(url)
    return this.http.get<ApiResult<CategoryType[]>>(url).pipe(
      map(res => res.object),
      catchError(err =>{ 
        console.log("Error",err);
        return of([])
  })
    )
  }

  //Agregar una categoria
  saveCategory(categoria: Partial<CategoryType>){
    return this.http.post(environment.apiUrl + "/categoryType",{
      name:categoria.name,
      description:categoria.description,
      image:categoria.image,
      parentCategoryType:categoria.parentCategoryType

    })
  }

  //Modificar una categoria
  modifyCategory(categoria: Partial<CategoryType>){
    return this.http.post(environment.apiUrl + "/categoryType",{
      id:categoria.id,
      name:categoria.name,
      description:categoria.description,
      image:categoria.image,
      parentCategoryType: categoria.parentCategoryType?.id || null
    })
  }
  

  //Borrar una categoria
  deleteCategory(id:any){
    return this.http.delete(environment.apiUrl + "/categoryType/" + id)
  }


















  //se suposa que TreeNode no es jerarquic, sols hi ha un nivell que son les fulles
  // de le categories
  transformToList(treeNode: TreeNode<CategoryType>[]): CategoryType[] {
    var vector: CategoryType[] = [];
    treeNode.forEach(node => {
      if (node.data) {
        vector.push(node.data)
      }
    })
    return vector;
  }
  transformToTreeNode(category: CategoryType): TreeNode<CategoryType> {
    var node: TreeNode<CategoryType>;
    node = {
      label: category.name,
      data: category,
      leaf: true,
      children: [],
      parent: undefined,
      expanded: true
    };
    return node;
  }

  transformRecursivelyToListTreeNode(data: CategoryType[] | null): TreeNode<CategoryType>[] {
    let nodes: TreeNode<CategoryType>[] = [];
    if (!data || data.length === 0) {
    }
    else {
      data?.forEach(category => {
        var node: TreeNode<CategoryType> = this.transformToTreeNode(category);
        var nodesFill: TreeNode<CategoryType>[] = this.transformRecursivelyToListTreeNode(category.subcategoriesType);
        nodesFill.forEach(nfill => {
          nfill.parent = node;
        })
        if (nodesFill.length > 0) {
          node.leaf = false;
        }
        node.children = nodesFill;
        nodes.push(node);
      })

    }
    return nodes;
  }

  formateCategoryToSubcategories(data: CategoryType[] | null) {
    const categories: CategoryType[] = []
    data?.forEach(element => {
      if (element.parentCategoryType === null) {
        categories.push(element)
      }
      
    });
    categories?.forEach(elementP => {
      data?.forEach(element => {
      if (element.parentCategoryType?.id === elementP.id) {
        elementP.subcategoriesType?.push(element)
      }
      
    });
      
    })
  
  }


  flattenTreetable(nodes: TreeNode<CategoryType>[], level = 0): ItemFlattened[] {
    let aplanats: ItemFlattened[] = [];
    nodes.forEach(node => {
      let nodetemp: ItemFlattened = { id: node.data!.id, label: node.label!, isLeaf: node.leaf!, level: level };
      // Afegim el node pare/intermedi
      aplanats.push(nodetemp);
      // Afegim els fills recursivament
      if (node.children) {
        aplanats = aplanats.concat(this.flattenTreetable(node.children, level + 1));
      }
    });
    return aplanats;
  }


}
