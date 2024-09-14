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
  intentosRestantes: number = 6; // Puedes ajustar el número de intentos
  puntuacion: number = 0;
  alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private ahorcadoService: AhorcadoService) {}

  ngOnInit() {
    // Llama al servicio para obtener las palabras cuando el componente carga
    this.ahorcadoService.obtenerPalabras().subscribe((palabras) => {
      this.palabras = palabras;
      console.log(this.palabras);
      this.seleccionarPalabra(); // Seleccionar una palabra al cargar
    });

    window.scrollTo(0, 0);
  }

  seleccionarPalabra() {
    if (this.palabras.length > 0) {
      this.palabraActual =
        this.palabras[Math.floor(Math.random() * this.palabras.length)];
      this.palabraOculta = this.palabraActual.split('').map(() => '_');
      this.letrasIncorrectas = [];
      this.intentosRestantes = 6; // Reiniciar intentos
    } else {
      this.palabraActual = null;
      this.palabraOculta = [];
    }
  }

  adivinarLetra(letra: string) {
    if (!this.palabraActual) return;

    const indices = [];
    for (let i = 0; i < this.palabraActual.length; i++) {
      if (this.palabraActual[i] === letra) {
        indices.push(i);
      }
    }

    if (indices.length > 0) {
      indices.forEach((index) => (this.palabraOculta[index] = letra));
      this.puntuacion += 1; // Sumar punto por letra correcta
    } else {
      this.letrasIncorrectas.push(letra);
      this.intentosRestantes--;
      this.puntuacion -= 1; // Restar punto por letra incorrecta
    }

    if (!this.palabraOculta.includes('_')) {
      alert('¡Felicidades! Has adivinado la palabra.');
      this.puntuacion += this.palabraActual.length; // Sumar puntos por adivinar la palabra
      this.seleccionarPalabra();
    } else if (this.intentosRestantes <= 0) {
      alert('¡Has perdido! La palabra era ' + this.palabraActual);
      this.puntuacion -= this.palabraActual.length; // Restar puntos por perder
      this.seleccionarPalabra();
    }
  }
}
