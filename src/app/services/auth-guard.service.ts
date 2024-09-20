import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Importa tu AuthService
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Método CanActivate para rutas normales
  // Solo bloquea la activación de la ruta, pero el módulo puede ser cargado previamente
  canActivate(): Observable<boolean> {
    return this.checkLogin();
  }

  // Método CanLoad para lazy-loaded modules
  // El guard detiene la carga del módulo completo antes de que llegue a ejecutar el componente del juego
  canLoad(): Observable<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean> {
    return this.authService.usuarioLogueado$.pipe(
      take(1), // Toma el primer valor emitido por el observable
      map((usuario) => {
        if (usuario) {
          return true;
        } else {
          Swal.fire({
            title: 'Acceso restringido',
            text: 'Necesitas iniciar sesión para acceder a esta sección.',
            icon: 'warning',
            confirmButtonText: 'Okey',
            background: '#fff',
            timer: 4000,
            timerProgressBar: true,
          });
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
