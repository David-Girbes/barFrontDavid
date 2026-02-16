import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../../model/apiResult';
import { Category } from '../../../../../barassistantshared/src/entity/Category';
import { TreeNode } from 'primeng/api';
import { Product } from '../../../../../barassistantshared/src/entity/Product';
import { Enterprise } from '@barassistantshared/entities';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient)

  //Coger las categorias
  getCategory():Observable<Category[]>{
    const url = environment.apiUrl + "/category"
    console.log(url)
    return this.http.get<ApiResult<Category[]>>(url).pipe(
      map(res => res.object),
      catchError(err =>{ 
        console.log("Error",err);
        return of([])
  })
    )
  } 

transformRecursivelyToListTreeNodeCat(data: Category[] | null): TreeNode<Category>[] {
    let nodes: TreeNode<Category>[] = [];
    if (!data || data.length === 0) {
    }
    else {
      data?.forEach((category: Category) => {
        var node: TreeNode<Category> = this.transformToTreeNodeCat(category);
        var nodesFill: TreeNode<Category>[] = this.transformRecursivelyToListTreeNodeCat(category.subcategories);
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

  transformToTreeNodeCat(category: Category): TreeNode<Category> {
    var node: TreeNode<Category>;
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

  saveCategory(categoria: Category){
      return this.http.post(environment.apiUrl + "/category",{
        name:categoria.name,
        description:categoria.description,
        image:categoria.image,
        parentCategory:categoria.parentCategory,
        products:categoria.products,
        subcategories:categoria.subcategories,
        enterpriseId:categoria.enterprise.id
  
      })
    }  
  
    //Borrar una categoria
    deleteCategory(id:any){
      return this.http.delete(environment.apiUrl + "/category/" + id)
    }

    getProductsByCategory(id:number):Observable<Product[]>{
        const url = environment.apiUrl + "/productsCategory/" + id
        console.log(url)
        return this.http.get<ApiResult<Product[]>>(url).pipe(
          map(res => res.object),
          catchError(err =>{ 
            console.log("Error",err);
            return of([])
      })
        )
      }
    

}
