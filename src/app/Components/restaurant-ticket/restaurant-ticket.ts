import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Button } from "primeng/button";

@Component({
  selector: 'app-restaurant-ticket',
  imports: [CommonModule, DatePipe, Button],
  templateUrl: './restaurant-ticket.html',
  styleUrl: './restaurant-ticket.css'
})
export class RestaurantTicket {
  
  ticketData = {
    enterprise: {
      name: 'Bar Restaurante El Buen Sabor',
      address: 'Calle Mayor, 123',
      city: 'Barcelona',
      phone: '+34 933 123 456',
      cif: 'B-12345678'
    },
    ticket: {
      number: 'T-2024-001234',
      date: new Date(),
      table: 'Mesa 15',
      waiter: 'Juan Pérez'
    },
    items: [
      { name: 'Ensalada César', quantity: 2, price: 8.50, total: 17.00 },
      { name: 'Solomillo a la pimienta', quantity: 1, price: 24.90, total: 24.90 },
      { name: 'Merluza al horno', quantity: 1, price: 18.50, total: 18.50 },
      { name: 'Patatas fritas', quantity: 2, price: 3.50, total: 7.00 },
      { name: 'Agua mineral 1L', quantity: 2, price: 2.50, total: 5.00 },
      { name: 'Vino tinto (copa)', quantity: 3, price: 3.00, total: 9.00 },
      { name: 'Café solo', quantity: 2, price: 1.50, total: 3.00 },
      { name: 'Tarta de queso', quantity: 1, price: 5.50, total: 5.50 }
    ],
    payment: {
      subtotal: 89.90,
      iva: 21,
      ivaAmount: 18.88,
      total: 108.78
    }
  };

  printTicket(): void {
    window.print();
  }

  calculateSubtotal(): number {
    return this.ticketData.items.reduce((sum, item) => sum + item.total, 0);
  }

  calculateIVA(): number {
    return (this.calculateSubtotal() * this.ticketData.payment.iva) / 100;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateIVA();
  }
}
