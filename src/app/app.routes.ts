//import { inject } from '@angular/core';
import { Routes } from '@angular/router';

export const routes:Routes = [
  {
    path: 'categories',
    loadComponent: () => import('./Components/category-type-management/category-type-management')
      .then(m => m.CategoryTypeManagement)
  },
  {
    path: 'products',
    loadComponent: () => import('./Components/manage-products-bar/manage-products-bar')
      .then(m => m.ManageProductsBar)
  },
  {
    path: 'ticket',
    loadComponent: () => import('./Components/restaurant-ticket/restaurant-ticket')
      .then(m => m.RestaurantTicket)
  },
]



