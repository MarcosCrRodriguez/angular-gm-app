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

  constructor(
    private ahorcadoService: AhorcadoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email);
      }
      this.usuarioLogueado = usuario;
    });
    this.authService.getRankingJuegos('preguntados').subscribe((data) => {
      if (data) {
        this.rankingData = data;
      } else {
        console.log('No se encontraron datos opcionales para este usuario.');
      }
    });
    window.scrollTo(0, 0);
  }
}
