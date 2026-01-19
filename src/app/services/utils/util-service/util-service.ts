import { Component, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  reproduirSoNotificacio() {
    const audio = new Audio('assets/sounds/bell.mp3');
    audio.play();
  }
}
