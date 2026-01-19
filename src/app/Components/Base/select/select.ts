import { Component, input, model, output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-select',
  imports: [SelectModule, FormsModule, InputTextModule],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class Select<T> {

  // Inputs
  items = input.required<T[]>();
  optionLabel = input<string>('name'); // Propietat per defecte per mostrar
  placeholder = input<string>('Selecciona una opció');
  // Output per emetre l'element seleccionat
  itemSelected = output<T>();

  // Model bidireccional (opcional)
  selectedItem = model<T | null>(null);

  onSelectionChange(item: T) {
    this.itemSelected.emit(item);
  }

}
