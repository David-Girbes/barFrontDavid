import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table',
  imports: [TableModule, Button],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  items: any[] = [];

}
