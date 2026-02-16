import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ManageProductsBar } from "./Components/manage-products-bar/manage-products-bar";
import { CategoryTypeManagement } from "./Components/category-type-management/category-type-management";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, DrawerModule, ButtonModule, ManageProductsBar, CategoryTypeManagement],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent {
  title = 'barAssistant';
  

  
}
