import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DiceService } from '../../../services/dice.service';
import { Cubilete } from '../../../models/cubilete';
import { juegos } from './../../../models/juegos-generala';

@Component({
  selector: 'app-generala',
  standalone: false,
  templateUrl: './generala.component.html',
  styleUrl: './generala.component.css',
})
export class GeneralaComponent implements OnInit {
  public usuarioLogueado: any = null;
  public cubilete: Cubilete = new Cubilete();
  public resultados: number[] = [1, 1, 1, 1, 1];
  public tiradasJugador: number = 0;
  public tiradasMaquina: number = 0;
  public turnoJugador: boolean = true;
  public maxTiradas: number = 3;
  public lanzandoMaquina: boolean = false;
  public turnoFinalizado: boolean = false;
  public tablaGenerala = [
    {
      juegos: 'Uno',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Dos',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Tres',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Cuatro',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Cinco',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Seis',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Escalera',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Full',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Poker',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    {
      juegos: 'Generala',
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    },
    // {
    //   juegos: 'GD',
    //   puntosJugador: '',
    //   puntosIA: '',
    //   disabled: false,
    //   selected: false,
    // },
  ];
  public juegoSeleccionado: number | null = null;
  public juegoYaSeleccionado: boolean = false;
  public juegosDisponibles = juegos.juegos;
  public juegos = juegos;
  public ptosJugador: any = 0;
  public ptosIA: any = 0;
  public contJugadasJugador: number = 10;
  public contJugadasIA: number = 10;
  public juegoIniciado: boolean = false;
  public juegoTerminado: boolean = false;
  public mensajeGanador: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private diceService: DiceService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });
    this.inicializarDados();
    window.scrollTo(0, 0);
  }

  lanzarDados() {
    if (this.puedeTirar()) {
      this.cubilete.tirarDados(this.diceService).then(() => {
        this.resultados = this.cubilete.dados.map((dado) => dado.valor);
        if (this.turnoJugador) {
          this.tiradasJugador++;
          console.log(`Jugador ha tirado ${this.tiradasJugador} veces`);
        }
      });
    }
  }

  seleccionarJuego(index: number) {
    // aseguramos que el jugador ya haya lanzado al menos una vez, y que esté en su turno
    if (
      this.tiradasJugador > 0 &&
      this.turnoJugador &&
      !this.juegoYaSeleccionado &&
      // verifica si el juego ya está bloqueado
      !this.tablaGenerala[index].disabledJugador
    ) {
      if (this.juegoSeleccionado === null) {
        this.juegoSeleccionado = index;
        // marcar que ya seleccionó un juego
        this.juegoYaSeleccionado = true;
        console.log('Juego seleccionado: ' + this.juegoSeleccionado);
        this.tablaGenerala[index].selected = true;
        this.evaluarJuego(this.tablaGenerala[index].juegos, index);
      }
    } else {
      console.log(
        'No puedes seleccionar este juego. Ya está seleccionado o no es tu turno.'
      );
    }
  }

  evaluarJuego(juego: string, index: number) {
    console.log('Resultados actuales:', this.resultados);
    const juegoEncontrado = juegos.juegos.find((j) => j.nombre === juego);
    this.contJugadasJugador--;

    if (juegoEncontrado) {
      const resultado = juegoEncontrado.evaluar(this.resultados);

      if (resultado.esPosible) {
        this.tablaGenerala[index].puntosJugador =
          resultado.puntaje?.toString() || '';
        this.ptosJugador += resultado.puntaje;
      } else {
        // Si no tiene puntaje, asignar 0
        this.tablaGenerala[index].puntosJugador = '0';
      }

      // Deshabilita la fila después de evaluar
      this.tablaGenerala[index].disabledJugador = true;
      this.juegoSeleccionado = null;
    }
  }

  terminarTurno() {
    console.log('Jugador decidió terminar su turno');
    this.verificarFinDelJuego();
    this.pasarTurno();
  }

  puedeTirar(): boolean {
    // Bloqueo si el juego ya ha terminado
    if (this.juegoTerminado) {
      return false;
    }
    // deshabilitar botón si la máquina está lanzando, si ya se seleccionó un juego, o si se alcanzó el límite de tiradas
    if (this.lanzandoMaquina || this.juegoYaSeleccionado) {
      return false;
    }
    return (
      this.turnoJugador &&
      this.tiradasJugador < this.maxTiradas &&
      !this.turnoFinalizado
    );
  }

  puedeTerminarTurno(): boolean {
    return (
      this.turnoJugador && this.tiradasJugador > 0 && !this.turnoFinalizado
    );
  }

  inicializarDados() {
    this.cubilete.reset();
  }

  async pasarTurno() {
    if (this.turnoJugador) {
      this.juegoYaSeleccionado = false;
      this.turnoJugador = false;
      this.tiradasMaquina = 0;
      console.log('Turno de la máquina');
      await this.simularTiradasMaquina();
      this.turnoJugador = true;
      this.tiradasJugador = 0;
      this.inicializarDados();
      this.turnoFinalizado = false;
      this.juegoSeleccionado = null;
      console.log('Tu turno');
    }
  }

  async simularTiradasMaquina() {
    this.cubilete.reset();
    this.lanzandoMaquina = true;

    let juegoSeleccionado = null;

    for (let i = 0; i < this.maxTiradas; i++) {
      await this.esperar(3000);
      await this.tirarDados();
      console.log(
        `Tirada de la máquina ${i + 1}:`,
        this.cubilete.getResultados()
      );

      const posiblesJuegos = this.evaluarJuegosPosibles(
        this.cubilete.getResultados()
      );
      console.log('Posibles juegos:', posiblesJuegos);

      if (posiblesJuegos) {
        if (i === this.maxTiradas - 1 || posiblesJuegos.puntaje >= 20) {
          juegoSeleccionado = posiblesJuegos;
          console.log(
            `La máquina selecciona el juego: ${juegoSeleccionado.nombre} con ${juegoSeleccionado.puntaje} puntos`
          );

          this.anotarPuntosIA(
            juegoSeleccionado.nombre,
            juegoSeleccionado.puntaje
          );
          // Salir del bucle si se seleccionó un juego
          break;
        }
      }
    }

    if (!juegoSeleccionado) {
      console.log(
        'La máquina no encontró un juego adecuado. Asignando puntaje 0 a un juego no anotado.'
      );

      // Asigna 0 a uno de los juegos que no tenga puntos anotados
      const juegoSinPuntos = this.tablaGenerala.find(
        (j) => j.puntosIA === '' && !j.disabledIA
      );

      if (juegoSinPuntos) {
        this.anotarPuntosIA(juegoSinPuntos.juegos, 0); // Anota 0
      } else {
        console.log('No hay juegos disponibles para anotar 0 puntos.');
      }
    }

    console.log('La máquina ha terminado sus tiradas');
    await this.esperar(3000);
    this.lanzandoMaquina = false;

    this.verificarFinDelJuego();
  }

  evaluarJuegosPosibles(
    resultados: number[]
  ): { nombre: string; puntaje: number } | null {
    for (const juego of this.juegosDisponibles) {
      const juegoYaSeleccionado = this.tablaGenerala.find(
        (j) => j.juegos === juego.nombre && (j.selectedIA || j.disabledIA)
      );

      if (!juegoYaSeleccionado) {
        const { esPosible, puntaje } = juego.evaluar(resultados);
        if (esPosible && puntaje !== null) {
          return { nombre: juego.nombre, puntaje };
        }
      }
    }
    return null;
  }

  anotarPuntosIA(nombreJuego: string, puntaje: number) {
    const juegoEncontrado = this.tablaGenerala.find(
      (juego) => juego.juegos === nombreJuego
    );

    this.contJugadasIA--;

    if (juegoEncontrado) {
      juegoEncontrado.puntosIA = puntaje.toString();
      this.ptosIA += puntaje;
      // Marcar como seleccionado por la IA
      juegoEncontrado.selectedIA = true;
      // Deshabilitar el juego para la IA
      juegoEncontrado.disabledIA = true;
      console.log(
        `Puntos actualizados para la IA en el juego ${nombreJuego}: ${puntaje}`
      );
    } else {
      console.log(`No se encontró el juego: ${nombreJuego}`);
    }
  }

  tirarDados(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.diceService.rollDice(5).subscribe(
        (data) => {
          this.resultados = data.result.random.data;
          // actualizamos los dados en cubilete
          this.resultados.forEach((valor, index) => {
            this.cubilete.dados[index].valor = valor;
          });
          console.log('Resultados:', this.resultados);
          resolve();
        },
        (error) => {
          console.error('Error al lanzar dados:', error);
          reject(error);
        }
      );
    });
  }

  esperar(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  toggleGuardarDado(index: number): void {
    if (this.turnoJugador && this.tiradasJugador > 0) {
      // solo permite guardar si ya se ha tirado
      this.cubilete.toggleGuardarDado(index);
    }
  }

  iniciarJuego() {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.contJugadasJugador = 10;
    this.contJugadasIA = 10;
    this.ptosJugador = 0;
    this.ptosIA = 0;
    this.resetTablaGenerala();
  }

  verificarFinDelJuego() {
    if (this.contJugadasJugador === 9 && this.contJugadasIA === 9) {
      this.juegoIniciado = false;
      this.juegoTerminado = true;
      if (this.ptosJugador > this.ptosIA) {
        this.mensajeGanador = `¡Jugador ha ganado con ${this.ptosJugador}`;
      } else if (this.ptosIA > this.ptosJugador) {
        this.mensajeGanador = `La IA ha ganado con ${this.ptosIA}`;
      } else {
        this.mensajeGanador = `Es un empate :O ${this.ptosJugador} a ${this.ptosIA}`;
      }
      console.log('Ganador determinado:', this.mensajeGanador);
    }
  }

  resetTablaGenerala() {
    this.tablaGenerala = this.tablaGenerala.map((juego) => ({
      juegos: juego.juegos,
      puntosJugador: '',
      puntosIA: '',
      disabledJugador: false,
      disabledIA: false,
      selected: false,
      selectedIA: false,
    }));
  }
}
