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
  public opciones: string[] = [];
  public respuestaCorrecta: string = '';
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

    window.scrollTo(0, 0);
  }

  iniciarPartida() {
    // Selecciona 10 países únicos para la partida
    this.partidaActual = this.seleccionarPaisesAleatorios(10);
    this.indicePregunta = 0;
    this.juegoTerminado = false;
    this.generarPregunta();
  }

  seleccionarPaisesAleatorios(n: number): any[] {
    // Asegúrate de que hay suficientes países
    if (n > this.paises.length) {
      console.error('No hay suficientes países disponibles para seleccionar.');
      return [];
    }

    // Baraja los países y selecciona los primeros n países únicos
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
    const tipoPregunta = Math.floor(Math.random() * 3);

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
    } else if (tipoPregunta === 2) {
      this.preguntaActual = `¿Cuál es el tamaño de la población de este país?`;
      this.respuestaCorrecta = paisAleatorio.poblacion.toString();
      this.opciones = this.generarOpciones(
        'poblacion',
        paisAleatorio.poblacion.toString()
      );
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
    this.cancelarTemporizador(); // Cancela el temporizador al responder

    if (opcionSeleccionada === this.respuestaCorrecta) {
      this.puntaje += 10 + this.tiempoRestante;
      alert('¡Correcto!');
    } else {
      this.puntaje -= 20;
      alert('Incorrecto, la respuesta correcta era ' + this.respuestaCorrecta);
    }

    this.indicePregunta++;

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
