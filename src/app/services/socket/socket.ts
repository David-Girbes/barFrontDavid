import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  //private subject = new Subject<any>();
  private currentRole: string | null = null; // Guardem el rol aquí per "memòria"

  constructor(private zone: NgZone) {
    this.socket = io(environment.server, {
      withCredentials: false,
      autoConnect: true
    });

    // AQUESTA ÉS LA CLAU: Un listener global per a reconnexions
    this.socket.on('connect', () => {
      console.log('✅ Socket connectat:', this.socket.id);
      if (this.currentRole) {
        console.log('🔄 Re-unit a la sala:', this.currentRole);
        this.joinRoom(this.currentRole);
      }
    });
  }

  inRoll(rol: string) {
    this.currentRole = rol; // Guardem el rol
    if (this.socket.connected) {
      this.joinRoom(rol);
    }
    // Si no està connectat, no cal fer el .on('connect') aquí,
    // perquè ja ho hem programat dalt en el constructor.
  }

  private joinRoom(role: string) {
    this.socket.emit('join_room', role);
  }

  /**
    * Escolta qualsevol esdeveniment del servidor i el retorna com a Observable
    */
  onEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>(suscriber => {
      console.log(`👂 Escoltant esdeveniment del socket: ${eventName}`);
      // Escoltat el missatge del socket
      this.socket.on(eventName, (data: T) => {
        // IMPORTANT: Executem dins de la zona d'Angular
        this.zone.run(() => {
          suscriber.next(data); // Enviem les dades al component
        });
        console.log(`📩 Rebut esdeveniment [${eventName}]:`, data);

      });

      // Opcional: Neteja quan el component es destrueix (unsubscribe)
      return () => {
        this.socket.off(eventName);
      };
    });
  }
}
