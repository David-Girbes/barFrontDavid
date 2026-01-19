import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Config {
  // Definim les constants com a readonly per seguretat
  readonly server = 'http://localhost:3000';
  readonly apiUrl = 'http://localhost:3000/api/bar_assistant/v1';
}
