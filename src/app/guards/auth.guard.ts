import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('user')!);
  // console.log(usuario);

  if (usuario) {
    return true;
  } else {
    authService.mostrarMsjError(
      'Acceso restringido',
      'No puedes acceder sin logearte'
    );
    router.navigate(['/error'], {
      state: { error: 'No puedes acceder sin logearte' },
    });
    return false;
  }
};
