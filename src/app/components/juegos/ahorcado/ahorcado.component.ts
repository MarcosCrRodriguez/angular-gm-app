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
  rondaTerminada: boolean = false;
  rondaGanda: boolean = false;
  juegoIniciado: boolean = false;
  juegoTerminado: boolean = false;
  palabrasJugadas: number = 0;
  maxPalabras: number = 5;
  mostrarMensajeFinal: boolean = false;
  alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private ahorcadoService: AhorcadoService) {}

  ngOnInit() {
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
