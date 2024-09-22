import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../../services/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DiceService } from '../../../services/dice.service';
import { Observer } from 'rxjs';
import { Cubilete } from '../../../models/cubilete';

@Component({
  selector: 'app-generala',
  standalone: false,
  templateUrl: './generala.component.html',
  styleUrl: './generala.component.css',
})
export class GeneralaComponent implements OnInit {
  public usuarioLogueado: any = null;
  public cubilete: Cubilete = new Cubilete(); // Inicializamos con 5 dados
  public resultados: number[] = [1, 1, 1, 1, 1]; // Iniciamos con 5 dados
  public tiradasJugador: number = 0;
  public tiradasMaquina: number = 0;
  public turnoJugador: boolean = true;
  public maxTiradas: number = 3;
  public lanzandoMaquina: boolean = false;
  public turnoFinalizado: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private diceService: DiceService
  ) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log(`${usuario.email} ingresó a la generala`);
      }
      this.usuarioLogueado = usuario;
    });
    this.inicializarDados();

    window.scrollTo(0, 0);
  }

  lanzarDados() {
    if (this.puedeTirar()) {
      this.cubilete.tirarDados(this.diceService).then(() => {
        if (this.turnoJugador) {
          this.tiradasJugador++;
          console.log(`Jugador ha tirado ${this.tiradasJugador} veces`);

          if (this.tiradasJugador === this.maxTiradas) {
            console.log(
              'Has realizado las 3 tiradas. Espera para terminar el turno.'
            );
          }
        }
      });
    }
  }

  terminarTurno() {
    console.log('Jugador decidió terminar su turno');
    this.pasarTurno();
  }

  puedeTirar(): boolean {
    if (this.lanzandoMaquina) {
      return false; // Deshabilitar botón cuando la máquina esté tirando
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
      this.turnoJugador = false;
      this.tiradasMaquina = 0; // Reiniciar las tiradas de la máquina
      console.log('Turno de la máquina');
      await this.simularTiradasMaquina(); // Espera a que la máquina termine sus tiradas
      this.turnoJugador = true;
      this.tiradasJugador = 0; // Reiniciar las tiradas del jugador
      this.inicializarDados(); // Inicializa los dados en 1
      this.turnoFinalizado = false; // Resetear el estado del turno finalizado

      // Aquí habilitamos los dados nuevamente
      this.cubilete.resetGuardado(); // Resetear estado de guardado

      console.log('Tu turno');
    }
  }

  async simularTiradasMaquina() {
    this.lanzandoMaquina = true; // Deshabilitar interacción del jugador
    for (let i = 0; i < this.maxTiradas; i++) {
      await this.esperar(2500);
      await this.tirarDados(); // Asegura que la tirada de la máquina espera a que termine
      console.log(`Tirada de la máquina ${i + 1}`);
    }
    console.log('La máquina ha terminado sus tiradas');

    await this.esperar(2500);
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
