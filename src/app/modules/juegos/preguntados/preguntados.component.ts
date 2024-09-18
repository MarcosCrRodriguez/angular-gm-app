import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent implements OnInit {
  public usuarioLogueado: any = null;
  public rankingData: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email);
      }
      this.usuarioLogueado = usuario;
    });

    window.scrollTo(0, 0);
  }
}
