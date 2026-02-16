import { Injectable } from '@angular/core';
import { Enterprise } from '@barassistantshared/entities';
//import * as DataEnterprise from './enterprise.json';


@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  private data: Enterprise[] = [
    {
      "id": 1,
      "name": "Bar La Plaça",
      "address": "Carrer Major 1, València",
      "phone": "963000001",
      "nif": "12345678A",
      "categories": [],
      "ingredients": [],
      "orders": [],
      "sections": [],
      "users": [],
      "products": [],
    }

  ]
  checkCredentials(email: string, passwd: string) {
    let enterprise = {}//this.entrerprises.find(e => e.email === email && e.passwd === passwd);
    return enterprise;
  }

  constructor() { }


  getData(): Enterprise[] {
    console.log(this.data);
    return this.data;
  }

  getNextId(): number {
    if (!this.data || this.data.length === 0) return 1;
    return this.data.reduce((max, it) => Math.max(max, it.id), 0) + 1;
  }
  deleteById(id: number): void {
    this.data = this.data.filter(i => i.id !== id);
  }
  updateProduct(enterprise: Enterprise): void {
    this.data = this.data.map(i => i.id === enterprise.id ? enterprise : i);
  }
  addEnterprise(enterprise: Enterprise): void {
    this.data = [...this.data, enterprise];
  }
}