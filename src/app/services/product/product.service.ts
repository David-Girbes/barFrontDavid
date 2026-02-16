import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../../model/apiResult';
import { Product } from '../../../../../barassistantshared/src/entity/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient)

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    const url = environment.apiUrl + "/products"
    return this.http.get<ApiResult<Product[]>>(url).pipe(
      map(res => res.object),
      catchError(err => { 
        console.log("Error", err);
        return of([])
      })
    )
  } 

  // Guardar un producto
  saveProduct(product: Partial<Product>) {
    return this.http.post(environment.apiUrl + "/product", {
      name: product.name,
      description: product.description,
      sellPrice: product.sellPrice,
      image: product.image,
      quantity: product.quantity,
      enterprise: product.enterprise,
      categories: product.categories
    })
  }  

  // Borrar un producto
  deleteProduct(id: any) {
    return this.http.delete(environment.apiUrl + "/products/" + id)
  }
}
