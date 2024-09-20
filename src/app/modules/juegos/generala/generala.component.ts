import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generala',
  standalone: false,
  templateUrl: './generala.component.html',
  styleUrl: './generala.component.css',
})
export class GeneralaComponent implements OnInit {
  public usuarioLogueado: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log(`${usuario.email} ingreso al la generala`);
      } else {
        this.authService.mustrarMensajeError();
        this.router.navigate(['/error'], {
          state: { error: 'No puede ingresar si no está logeado' },
        });
      }
      this.usuarioLogueado = usuario;
    });

    window.scrollTo(0, 0);
  }
}
