import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DiceService } from '../../../services/dice.service';
import { Observer } from 'rxjs';
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
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Dos',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Tres',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Cuatro',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Cinco',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Seis',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Escalera',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Full',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Poker',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
    },
    {
      juegos: 'Generala',
      puntosJugador: '',
      puntosIA: '',
      disabled: false,
      selected: false,
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
  public juegos = juegos;

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
        this.resultados = this.cubilete.dados.map((dado) => dado.valor); // Asegura que siempre uses los dados actuales
        if (this.turnoJugador) {
          this.tiradasJugador++;
          console.log(`Jugador ha tirado ${this.tiradasJugador} veces`);
        }
      });
    }
  }

  seleccionarJuego(index: number) {
    // Aseguramos que el jugador ya haya lanzado al menos una vez, y que esté en su turno
    if (
      this.tiradasJugador > 0 &&
      this.turnoJugador &&
      !this.juegoYaSeleccionado &&
      !this.tablaGenerala[index].disabled // Verifica si el juego ya está bloqueado
    ) {
      if (this.juegoSeleccionado === null) {
        this.juegoSeleccionado = index;
        this.juegoYaSeleccionado = true; // Marcar que ya seleccionó un juego
        console.log('Juego seleccionado: ' + this.juegoSeleccionado);
        this.tablaGenerala[index].selected = true;
        this.evaluarJuego(this.tablaGenerala[index].juegos, index); // Evaluamos el juego
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

    if (juegoEncontrado) {
      const resultado = juegoEncontrado.evaluar(this.resultados);

      if (resultado.esPosible) {
        this.tablaGenerala[index].puntosJugador =
          resultado.puntaje?.toString() || '';
      } else {
        this.tablaGenerala[index].puntosJugador = ''; // No tiene puntaje, se muestra "X"
      }

      this.tablaGenerala[index].disabled = true; // Deshabilita la fila después de evaluar
      this.juegoSeleccionado = null; // Permitir seleccionar otro juego después
    }
  }

  terminarTurno() {
    console.log('Jugador decidió terminar su turno');
    this.pasarTurno();
  }

  puedeTirar(): boolean {
    // Deshabilitar botón si la máquina está lanzando, si ya se seleccionó un juego, o si se alcanzó el límite de tiradas
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
    this.cubilete.reset(); // Reseteamos los dados a 1 y no guardados
  }

  async pasarTurno() {
    if (this.turnoJugador) {
      this.juegoYaSeleccionado = false; // Resetear selección de juego al pasar turno
      this.turnoJugador = false;
      this.tiradasMaquina = 0;
      console.log('Turno de la máquina');
      await this.simularTiradasMaquina();
      this.turnoJugador = true;
      this.tiradasJugador = 0;
      this.inicializarDados();
      this.turnoFinalizado = false;
      this.juegoSeleccionado = null; // Resetear juego seleccionado para el siguiente turno
      console.log('Tu turno');
    }
  }

  async simularTiradasMaquina() {
    this.cubilete.reset();
    this.lanzandoMaquina = true; // Deshabilitar interacción del jugador
    for (let i = 0; i < this.maxTiradas; i++) {
      await this.esperar(3000);
      await this.tirarDados(); // Asegura que la tirada de la máquina espera a que termine
      console.log(`Tirada de la máquina ${i + 1}`);
    }
    console.log('La máquina ha terminado sus tiradas');

    await this.esperar(3000);
    this.lanzandoMaquina = false; // Habilitar interacción del jugador después de que la máquina termine
  }

  tirarDados(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.diceService.rollDice(5).subscribe(
        (data) => {
          this.resultados = data.result.random.data;
          // Actualizamos los dados en cubilete
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
      // Solo permite guardar si ya se ha tirado
      this.cubilete.toggleGuardarDado(index);
    }
  }
}
