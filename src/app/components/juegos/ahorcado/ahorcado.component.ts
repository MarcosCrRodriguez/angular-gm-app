import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent implements OnInit {
  public palabras: string[] = [];
  public palabraActual: string | null = null;
  public palabraOculta: string[] = [];
  public letrasIncorrectas: string[] = [];
  public intentosRestantes: number = 6;
  public puntuacion: number = 0;
  public rondaTerminada: boolean = false;
  public rondaGanda: boolean = false;
  public juegoIniciado: boolean = false;
  public juegoTerminado: boolean = false;
  public palabrasJugadas: number = 0;
  public maxPalabras: number = 5;
  public mostrarMensajeFinal: boolean = false;
  public rankingData: any;
  public usuarioLogueado: any = null;
  public alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(
    private ahorcadoService: AhorcadoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email); // Mostrar el email del usuario
      }
      this.usuarioLogueado = usuario;
    });
    this.authService.getRankingJuegos('ahorcado').subscribe((data) => {
      if (data) {
        this.rankingData = data;
      } else {
        console.log('No se encontraron datos opcionales para este usuario.');
      }
    });
    this.ahorcadoService
      .obtenerPalabras(this.maxPalabras)
      .subscribe((palabras) => {
        this.palabras = palabras;
      });

    window.scrollTo(0, 0);
  }

  seleccionarPalabra() {
    if (this.palabras.length > 0) {
      const indice = Math.floor(Math.random() * this.palabras.length);
      this.palabraActual = this.palabras[indice];

      this.palabras.splice(indice, 1);

      this.palabraOculta = this.palabraActual.split('').map(() => '_');
      this.letrasIncorrectas = [];
      this.intentosRestantes = 6;
    } else {
      this.palabraActual = null;
      this.palabraOculta = [];
    }
  }

  adivinarLetra(letra: string) {
    if (!this.palabraActual || this.rondaTerminada) return;

    const indices = [];
    for (let i = 0; i < this.palabraActual.length; i++) {
      if (this.palabraActual[i] === letra) {
        indices.push(i);
      }
    }

    if (indices.length > 0) {
      indices.forEach((index) => (this.palabraOculta[index] = letra));
      this.puntuacion += 1;
    } else {
      this.letrasIncorrectas.push(letra);
      this.intentosRestantes--;
      this.puntuacion -= 1;
    }

    if (!this.palabraOculta.includes('_')) {
      this.mostrarUltimaImagen();
      this.puntuacion += this.palabraActual.length;
      this.rondaTerminada = true;
      this.rondaGanda = true;
      this.palabrasJugadas++;
      this.verificarFinDelJuego();
    } else if (this.intentosRestantes <= 0) {
      this.mostrarUltimaImagen();
      this.puntuacion -= this.palabraActual.length;
      this.rondaTerminada = true;
      this.palabrasJugadas++;
      this.verificarFinDelJuego();
    }
  }

  mostrarUltimaImagen() {
    this.intentosRestantes = 0;
  }

  continuar() {
    if (this.palabrasJugadas < this.maxPalabras) {
      this.rondaTerminada = false;
      this.rondaGanda = false;
      this.seleccionarPalabra();
    }
  }

  comenzar() {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.palabrasJugadas = 0;
    this.mostrarMensajeFinal = false;
    this.seleccionarPalabra();
  }

  verificarFinDelJuego() {
    if (this.palabrasJugadas >= this.maxPalabras) {
      this.rondaTerminada = false;
      this.juegoTerminado = true;
      this.mostrarMensajeFinal = true;
      if (this.usuarioLogueado && this.usuarioLogueado.email) {
        this.authService.scoreJuegos(
          this.usuarioLogueado.email,
          this.puntuacion,
          'ahorcado'
        );
      }
    }
  }

  volverInicio() {
    this.puntuacion = 0;
    this.palabras = [];
    this.rondaGanda = false;
    this.juegoIniciado = false;
    this.mostrarMensajeFinal = false;
    this.ahorcadoService.obtenerPalabras().subscribe((palabras) => {
      this.palabras = palabras;
    });
  }
}
