import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, DrawerModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})
export class AppComponent {
  title = 'barAssistant';
  private router = inject(Router);
  visible = signal(false);
  
navegar(ruta: string) {
    this.router.navigate([ruta]);
    this.visible.set(false);      
  }
  
}
