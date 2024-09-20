import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
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
  public usuarioLogueado: any = null;
  public opcionesIngles: boolean = false;
  public idiomaBloqueado: boolean = false;
  public tipoPalabras: string = 'Español: General';
  public alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(
    private ahorcadoService: AhorcadoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log(`${usuario.email} ingreso al ahorcado`);
      } else {
        this.authService.mustrarMensajeError();
        this.router.navigate(['/error'], {
          state: { error: 'No puede ingresar si no está logeado' },
        });
      }
      this.usuarioLogueado = usuario;
    });

    this.ahorcadoService
      .obtenerPalabras(this.maxPalabras)
      .subscribe((palabras) => {
        this.palabras = palabras;
        // console.log(this.palabras);
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
      // this.mostrarUltimaImagen();
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

  elegirCastellano() {
    this.ahorcadoService.obtenerPalabras().subscribe((palabras) => {
      this.palabras = palabras;
      this.tipoPalabras = 'Español: General';
      // console.log('Palabras:', this.palabras);
    });
  }

  elegirIngles() {
    this.opcionesIngles = true;
    this.idiomaBloqueado = true;
  }

  chooseAdjectives() {
    this.ahorcadoService
      .getWordsAnjectives(this.maxPalabras)
      .subscribe((palabras) => {
        this.palabras = palabras;
        this.tipoPalabras = 'English: Adjectives';
        // console.log('Palabras:', this.palabras);
      });
    this.idiomaBloqueado = false;
    this.opcionesIngles = false;
  }

  chooseNouns() {
    this.ahorcadoService
      .getWordsNouns(this.maxPalabras)
      .subscribe((palabras) => {
        this.palabras = palabras;
        this.tipoPalabras = 'English: Nouns';
        // console.log('Palabras:', this.palabras);
      });
    this.idiomaBloqueado = false;
    this.opcionesIngles = false;
  }

  chooseAnimals() {
    this.ahorcadoService
      .getWordsAnimals(this.maxPalabras)
      .subscribe((palabras) => {
        this.palabras = palabras;
        this.tipoPalabras = 'English: Animals';
        // console.log('Palabras:', this.palabras);
      });
    this.idiomaBloqueado = false;
    this.opcionesIngles = false;
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
