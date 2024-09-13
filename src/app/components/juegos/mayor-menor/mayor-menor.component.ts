import { Component, OnInit } from '@angular/core';
import { CardService } from './../../../services/card.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css',
})
export class MayorMenorComponent implements OnInit {
  public idMazo: string = '';
  public cartaActual: any = null;
  public cartaSiguiente: any = null;
  public juegoIniciado: boolean = false;
  public cartasRestantes: number = 0;
  public puntos: number = 0; // Puntos del jugador
  public cargando: boolean = false;
  public dorsoCarta: string = 'https://deckofcardsapi.com/static/img/back.png';
  public mensajeResultado: string = ''; // Mensaje de resultado de la elección
  public botonesDeshabilitados: boolean = false; // Estado de los botones
  public cartaAnterior: any = null;
  public esPrimeraRonda: boolean = true;

  constructor(private cartaService: CardService) {}

  ngOnInit(): void {
    // Creamos el mazo al iniciar el componente
    this.crearNuevoMazo();
  }

  crearNuevoMazo(): void {
    this.cartaService.crearMazo().subscribe((respuesta) => {
      this.idMazo = respuesta.deck_id;
      this.cartasRestantes = respuesta.remaining;
    });
  }

  iniciarJuego(): void {
    if (!this.idMazo) return;

    this.cargando = true;
    this.juegoIniciado = true;
    this.sacarDosCartas(); // Sacar dos cartas para iniciar el juego
  }

  // Método para sacar dos cartas del mazo
  sacarDosCartas(): void {
    if (!this.idMazo) {
      console.log('No se ha creado un mazo.');
      return;
    }

    this.cartaService.sacarDosCartas(this.idMazo).subscribe((respuesta) => {
      if (respuesta.cards.length === 2) {
        if (this.esPrimeraRonda) {
          // En la primera ronda, mostramos el dorso como carta anterior
          this.cartaAnterior = { image: this.dorsoCarta };
          this.esPrimeraRonda = false;
        } else {
          // En rondas siguientes, guardamos la carta actual en cartaAnterior
          this.cartaAnterior = this.cartaActual;
        }

        this.cartaActual = respuesta.cards[0]; // La primera carta se muestra al jugador
        this.cartaSiguiente = respuesta.cards[1]; // La segunda carta se usa para comparación inicial
        this.cartasRestantes = respuesta.remaining - 2; // Actualizamos el número de cartas restantes
        this.cargando = false;
        this.mensajeResultado = ''; // Limpiamos el mensaje de resultado
      } else {
        console.log('No se pudieron sacar las dos cartas.');
      }
    });
  }
  // Método para sacar una nueva carta del mazo
  sacarCarta(): void {
    if (!this.idMazo) {
      console.log('No se ha creado un mazo.');
      return;
    }

    this.cartaService.sacarCarta(this.idMazo).subscribe((respuesta) => {
      if (respuesta.cards.length > 0) {
        this.cartaSiguiente = respuesta.cards[0]; // La nueva carta se convierte en la siguiente
        this.cartasRestantes = respuesta.remaining;
        this.cargando = false;
      } else {
        console.log('No se pudieron sacar cartas.');
      }
    });
  }

  // Método que maneja la elección del jugador
  eleccionJugador(opcion: string): void {
    if (this.cartasRestantes > 0) {
      if (this.cartaActual && this.cartaSiguiente) {
        this.botonesDeshabilitados = true; // Deshabilitar botones
        setTimeout(() => {
          // Evaluamos la elección del jugador después de un retraso de 500 ms
          const resultadoCorrecto = this.evaluarResultado(opcion);
          if (resultadoCorrecto) {
            this.puntos++; // Sumamos puntos si la elección fue correcta
            this.mensajeResultado = '¡Acertaste!';
          } else {
            this.mensajeResultado = '¡Fallaste!';
          }

          // Guarda la carta actual en cartaAnterior antes de actualizar
          this.cartaAnterior = this.cartaActual;
          this.cartaActual = this.cartaSiguiente;
          this.cartaSiguiente = null; // Limpiamos la carta siguiente para la próxima comparación
          this.sacarCarta();

          this.botonesDeshabilitados = false; // Habilitar botones después del retraso
        }, 500); // Retraso de 500 ms
      } else {
        console.log('No se pueden evaluar las cartas porque faltan cartas.');
      }
    } else {
      console.log('No quedan más cartas en el mazo');
    }
  }

  // Método para evaluar si la elección fue correcta
  evaluarResultado(opcion: string): boolean {
    const valorActual = this.obtenerValorCarta(this.cartaActual.value);
    const valorSiguiente = this.obtenerValorCarta(this.cartaSiguiente.value);

    if (opcion === 'alto' && valorActual > valorSiguiente) {
      return true; // La carta siguiente es mayor, opción "alto" es correcta
    } else if (opcion === 'bajo' && valorActual < valorSiguiente) {
      return true; // La carta siguiente es menor, opción "bajo" es correcta
    } else if (opcion === 'igual' && valorActual === valorSiguiente) {
      return true; // Las cartas son iguales, opción "igual" es correcta
    }
    return false; // La elección fue incorrecta
  }

  // Convertir el valor de la carta a un número para comparar (A=1, J=11, Q=12, K=13)
  obtenerValorCarta(valor: string): number {
    switch (valor) {
      case 'ACE':
        return 1;
      case 'JACK':
        return 11;
      case 'QUEEN':
        return 12;
      case 'KING':
        return 13;
      default:
        return parseInt(valor);
    }
  }

  // Método para volver al menú principal
  volverAlMenu(): void {
    this.cartaActual = null;
    this.cartaSiguiente = null;
    this.cartaAnterior = null;
    this.juegoIniciado = false;
    this.esPrimeraRonda = true;
    this.cartasRestantes = 0;
    this.puntos = 0;
    this.cargando = false;
    this.mensajeResultado = '';
    // Aquí puedes agregar la lógica para reiniciar el mazo si es necesario
    this.cartaService.crearMazo().subscribe((respuesta) => {
      this.idMazo = respuesta.deck_id;
      this.cartasRestantes = respuesta.remaining;
    });
  }
}
