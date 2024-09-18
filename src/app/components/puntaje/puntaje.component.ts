import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-puntaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puntaje.component.html',
  styleUrl: './puntaje.component.css',
})
export class PuntajeComponent implements OnInit {
  public rankingAhorcado: any;
  public rankingMayorMenor: any;
  public rankingPreguntados: any;
  public rankingGenerala: any;
  public usuarioLogueado: any = null;
  public isLoading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email);
      }
      this.usuarioLogueado = usuario;
    });

    // Obtener rankings de Ahorcado
    this.authService.getRankingJuegos('ahorcado').subscribe((data) => {
      this.rankingAhorcado = data
        ? data
        : 'No se encontraron datos de Ahorcado';
      this.checkDataLoad(); // Verificar si ya terminó la carga
    });

    // Obtener rankings de Mayor Menor
    this.authService.getRankingJuegos('mayor-menor').subscribe((data) => {
      this.rankingMayorMenor = data
        ? data
        : 'No se encontraron datos de Mayor Menor';
      this.checkDataLoad(); // Verificar si ya terminó la carga
    });

    // Obtener rankings de Preguntados
    this.authService.getRankingJuegos('preguntados').subscribe((data) => {
      if (data) {
        this.rankingPreguntados = data;
      } else {
        console.log('No se encontraron datos opcionales para este usuario.');
      }
    });

    // Obtener rankings de Generala
    this.authService.getRankingJuegos('generala').subscribe((data) => {
      this.rankingGenerala = data
        ? data
        : 'No se encontraron datos de Generala';
      this.checkDataLoad(); // Verificar si ya terminó la carga
    });

    window.scrollTo(0, 0);
  }

  // Función para ocultar el GIF una vez que los datos estén listos
  checkDataLoad() {
    if (
      this.rankingAhorcado &&
      this.rankingMayorMenor &&
      this.rankingGenerala
    ) {
      this.isLoading = false;
    }
  }
}
