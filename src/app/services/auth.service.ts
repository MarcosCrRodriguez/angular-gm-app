import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// indica que el servicio -> singleton y se proporciona en el nivel raíz de la aplicación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);

  constructor() {
    // se verifica si hay un usuario guardado en localStorage
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      // actualiza el BehaviorSubject con los datos del usuario guardado
      this.usuarioLogueadoSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  get usuarioLogueado$() {
    // permite a los componentes suscribirse a los cambios en el estado del usuario logueado
    return this.usuarioLogueadoSubject.asObservable();
  }

  loguear(usuario: any) {
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    this.usuarioLogueadoSubject.next(usuario);
  }

  logout() {
    // Borra el estado del usuario y redirige a la página de login
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueadoSubject.next(null);
  }
}
