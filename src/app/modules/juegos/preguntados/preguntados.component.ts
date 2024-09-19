import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
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
  public juegoIniciado: boolean = false; // Nueva variable

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
    this.partidaActual = this.seleccionarPaisesAleatorios(10);
    this.indicePregunta = 0;
    this.juegoTerminado = false;
    this.generarPregunta();
  }

  seleccionarPaisesAleatorios(n: number): any[] {
    const paisesAleatorios = [...this.paises];
    return paisesAleatorios.sort(() => Math.random() - 0.5).slice(0, n);
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
  }

  generarOpciones(campo: string, correcta: string): string[] {
    const opciones = new Set<string>();
    opciones.add(correcta);

    while (opciones.size < 4) {
      const pais = this.paises[Math.floor(Math.random() * this.paises.length)];
      opciones.add(pais[campo].toString());
    }

    return Array.from(opciones).sort(() => Math.random() - 0.5);
  }

  verificarRespuesta(opcionSeleccionada: string) {
    if (opcionSeleccionada === this.respuestaCorrecta) {
      alert('¡Correcto!');
    } else {
      alert('Incorrecto, la respuesta correcta era ' + this.respuestaCorrecta);
    }

    this.indicePregunta++;

    if (this.indicePregunta < this.partidaActual.length) {
      this.generarPregunta();
    } else {
      this.juegoTerminado = true;
    }
  }

  reiniciarJuego() {
    this.iniciarPartida();
  }

  comenzar() {
    this.juegoIniciado = true; // Cambia el estado del juego a iniciado
    this.iniciarPartida();
  }
}
