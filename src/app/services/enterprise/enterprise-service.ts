import { Injectable } from '@angular/core';
import { Enterprise } from '@barassistantshared/entities';


@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  checkCredentials(email: string, passwd: string) {
    let enterprise = this.entrerprises.find(e => e.email === email && e.passwd === passwd);
    return enterprise;
  }
  entrerprises: Enterprise[] = [
    {
      id: 1, name: 'Bar Central', address: 'Carrer Major, 1',
      phone: '123456789', email: 'barcentral@gmail.com', passwd: 'barcentral', nif: '12345678A'
    },
    {
      id: 2, name: 'Bar Zaragosa', address: 'Carrer Menor, 1',
      phone: '123456789', email: 'barzaragosa@gmail.com', passwd: 'barsaragosa', nif: '12345678B'
    },
  ];
  constructor() { }
}
