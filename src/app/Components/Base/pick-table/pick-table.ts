import { Component, Inject, input, model, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { Message } from '../message/message';
import { MessageBox } from "../message-box/message-box";
import { Id } from '../../../model/id';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-pick-table',
  imports: [CommonModule, TreeTableModule, ButtonModule, MessageBox, FormsModule,
    InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './pick-table.html',
  styleUrl: './pick-table.css'
})
export class PickTable<T> {

  message: string = '';
  selectedNodeRight!: TreeNode<T>;
  selectedNodeLeft!: TreeNode<T>;
  inputData1 = input<TreeNode<T>[]>([]);
  modelData2 = model<TreeNode<T>[]>([]);
  width = input<string>('10%');
  //outputData = output<TreeNode<T>[]>();
  values2 = signal<TreeNode<T>[]>([]);
  constructor() {
    console.log('LoadBarProducts initialized');
    console.log(this.inputData1());
  }
  moveToLeft($event: Event) {
    console.log("moveToLeft")
    if (!this.selectedNodeRight) {
      this.message = 'Cal seleccionar un element';
      console.warn('Selecció invàlida: Selecciona una fulla per transferir.');
      return;
    }
    else {
      if (!this.selectedNodeRight.leaf) {
        this.message = 'Selecció invàlida: Selecciona una fulla per transferir.';
        return;
      }
    }

    const index = this.modelData2().findIndex(n => n.data === this.selectedNodeRight.data);
    console.log(index)
    if (index >= 0) {
      this.modelData2.update(currentValue => {
        console.log('currentValue de update');
        console.log(currentValue);
        const newArray = [...currentValue];
        newArray.splice(index, 1);
        //this.inputData2.set(newArray);
        return newArray;
      });
    }
  }
  moveToRight($event: Event) {
    console.log('moveToRigth:');
    console.log($event);
    if (!this.selectedNodeLeft) {
      this.message = 'Cal seleccionar un element';
      console.warn('Selecció invàlida: Selecciona una fulla per transferir.');
      return;
    }
    else {
      if (!this.selectedNodeLeft.leaf) {
        this.message = 'Selecció invàlida: Selecciona una fulla per transferir.';
        return;
      }
    }
    // --- A. ACTUALITZACIÓ DEL DESTÍ (value2) ---
    const pos = this.modelData2().findIndex(n => ((n.data as Id).id === (this.selectedNodeLeft.data as Id).id));
    console.log(pos);
    if (pos < 0) {
      this.modelData2.update(currentValue => {

        // Crear un nou array amb el node afegit (important per al Signal)
        // Cal fer una còpia del node per trencar les referències, especialment el 'parent'
        //const newNode = { ...this.selectedNode };
        const newList = [...currentValue, this.selectedNodeLeft];
        //console.log(newList)
        return newList;
      });

      //this.outputData.emit(this.values2());
      console.log('Després d\'afegir a value2:');
      console.log(this.modelData2());
    }
    else {
      this.message = 'El node ja existeix al llistat de destinació.';
    }
  }
  selectNodeLeft($event: any) {
    this.selectedNodeLeft = $event.node;
    console.log('selectNodeLeft:');
    console.log($event);
  }
  selectNodeRight($event: any) {
    this.selectedNodeRight = $event.node;
    console.log('selectNodeRight:');
    console.log($event);
  }
}


