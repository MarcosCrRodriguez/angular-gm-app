import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const admin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('user')!);

  if (!usuario) {
    authService.mostrarMsjError(
      'Acceso restringido',
      'Debes iniciar sesión para acceder a esta página'
    );
    router.navigate(['/error'], {
      state: { error: 'Debes iniciar sesión para acceder a esta página' },
    });
    return of(false);
  }

  if (usuario.rol == 'admin') {
    console.log('Usuario autorizado como admin');
    return true;
  } else {
    authService.mostrarMsjError(
      'Acceso restringido',
      'No tienes permisos para acceder a esta página'
    );
    router.navigate(['/error'], {
      state: { error: 'No tienes permisos para acceder a esta página' },
    });
    return false;
  }
};
