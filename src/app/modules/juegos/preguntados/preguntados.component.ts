import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { BanderasService } from '../../../services/banderas.service';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent implements OnInit {
  public usuarioLogueado: any = null;
  public paises: any[] = [];
  public partidaActual: any[] = [];
  public preguntaActual: string = '';
  public cantidadParaPartida: number = 10;
  public opciones: string[] = [];
  public respuestaCorrecta: string = '';
  public mensajeRespuesta: string = '';
  public mensajeVacio: string = '¿ ?';
  public jugadorExito: boolean = false;
  public enEspera: boolean = false;
  public imagenBandera: string = '';
  public indicePregunta: number = 0;
  public juegoTerminado: boolean = false;
  public juegoIniciado: boolean = false;
  public puntaje: number = 0;
  public tiempoRestante: number = 30;
  private temporizador: any;

  constructor(
    private banderasService: BanderasService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email);
      }
      this.usuarioLogueado = usuario;
    });

    this.banderasService.getPaises().subscribe((data) => {
      this.paises = data;
    });

    this.juegoIniciado = false;
    this.juegoTerminado = false;

    window.scrollTo(0, 0);
  }

  iniciarPartida() {
    this.partidaActual = this.seleccionarPaisesAleatorios(
      this.cantidadParaPartida
    );
    this.indicePregunta = 0;
    this.juegoTerminado = false;
    this.generarPregunta();
  }

  seleccionarPaisesAleatorios(n: number): any[] {
    if (n > this.paises.length) {
      console.error('No hay suficientes países disponibles para seleccionar.');
      return [];
    }

    const paisesAleatorios = [...this.paises];
    const seleccionados = new Set<any>();
    while (seleccionados.size < n) {
      const pais = paisesAleatorios.splice(
        Math.floor(Math.random() * paisesAleatorios.length),
        1
      )[0];
      seleccionados.add(pais);
    }
    return Array.from(seleccionados);
  }

  generarPregunta() {
    if (this.indicePregunta >= this.partidaActual.length) {
      this.juegoTerminado = true;
      return;
    }

    const paisAleatorio = this.partidaActual[this.indicePregunta];
    const tipoPregunta = Math.floor(Math.random() * 2);

    if (tipoPregunta === 0) {
      this.preguntaActual = `¿De qué continente es la bandera?`;
      this.respuestaCorrecta = paisAleatorio.continente;
      this.opciones = this.generarOpciones(
        'continente',
        paisAleatorio.continente
      );
    } else if (tipoPregunta === 1) {
      this.preguntaActual = `¿De qué país es esta bandera?`;
      this.respuestaCorrecta = paisAleatorio.nombre;
      this.opciones = this.generarOpciones('nombre', paisAleatorio.nombre);
    }

    this.imagenBandera = paisAleatorio.bandera;
    this.iniciarTemporizador();
  }

  generarOpciones(campo: string, correcta: string): string[] {
    const opciones = new Set<string>();
    opciones.add(correcta);

    while (opciones.size < 4) {
      const pais = this.paises[Math.floor(Math.random() * this.paises.length)];
      if (pais[campo] !== correcta) {
        opciones.add(pais[campo].toString());
      }
    }

    return Array.from(opciones).sort(() => Math.random() - 0.5);
  }

  iniciarTemporizador() {
    this.tiempoRestante = 30;
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.cancelarTemporizador();
        this.verificarRespuesta(''); // Pasa a la siguiente pregunta cuando el tiempo se agote
      }
    }, 1000);
  }

  cancelarTemporizador() {
    if (this.temporizador) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  verificarRespuesta(opcionSeleccionada: string) {
    this.cancelarTemporizador();
    this.enEspera = true;

    if (opcionSeleccionada === this.respuestaCorrecta) {
      this.jugadorExito = true;
      this.puntaje += 10 + this.tiempoRestante;
      this.mensajeRespuesta = '¡Correcto!';
    } else {
      this.jugadorExito = false;
      this.puntaje -= 20;
      this.mensajeRespuesta = `'La correcta es ${this.respuestaCorrecta}'`;
    }

    setTimeout(() => {
      this.indicePregunta++;
      this.enEspera = false;
      if (this.indicePregunta < this.partidaActual.length) {
        this.generarPregunta();
      } else {
        this.juegoTerminado = true;
        this.authService.scoreJuegos(
          this.usuarioLogueado.email,
          this.puntaje,
          'preguntados'
        );
      }
    }, 2500);
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.juegoIniciado = false;
    this.juegoTerminado = false;
  }

  comenzar() {
    this.juegoIniciado = true; // Cambia el estado del juego a iniciado
    this.iniciarPartida();
  }
}
