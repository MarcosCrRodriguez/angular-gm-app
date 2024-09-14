import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css',
})
export class AhorcadoComponent implements OnInit {
  palabras: string[] = [];
  palabraActual: string | null = null;
  palabraOculta: string[] = [];
  letrasIncorrectas: string[] = [];
  intentosRestantes: number = 6;
  puntuacion: number = 0;
  alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  juegoTerminado: boolean = false; // Variable que controla el estado del juego

  constructor(private ahorcadoService: AhorcadoService) {}

  ngOnInit() {
    this.ahorcadoService.obtenerPalabras().subscribe((palabras) => {
      this.palabras = palabras;
      this.seleccionarPalabra();
    });

    window.scrollTo(0, 0);
  }

  seleccionarPalabra() {
    if (this.palabras.length > 0) {
      this.palabraActual =
        this.palabras[Math.floor(Math.random() * this.palabras.length)];
      this.palabraOculta = this.palabraActual.split('').map(() => '_');
      this.letrasIncorrectas = [];
      this.intentosRestantes = 6;
    } else {
      this.palabraActual = null;
      this.palabraOculta = [];
    }
  }

  async adivinarLetra(letra: string) {
    if (!this.palabraActual || this.juegoTerminado) return;

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
      await this.mostrarUltimaImagen();
      this.puntuacion += this.palabraActual.length;
      this.juegoTerminado = true;
    } else if (this.intentosRestantes <= 0) {
      await this.mostrarUltimaImagen();
      this.puntuacion -= this.palabraActual.length;
      this.juegoTerminado = true;
    }
  }

  // Función para dibujar la última imagen antes de que el juego termine
  mostrarUltimaImagen() {
    this.intentosRestantes = 0;
  }

  // Esta función se ejecutará cuando el usuario presione "Continuar"
  continuar() {
    this.juegoTerminado = false; // Restablecemos el estado del juego
    this.seleccionarPalabra(); // Reiniciamos el juego
  }
}
