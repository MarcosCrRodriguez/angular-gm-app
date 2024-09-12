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
  mazoID: string = '';
  cartaUno: any = null;
  cartaDos: any = null;
  puntosJugador: number = 0;
  puntosIA: number = 0;
  noMasCartas: boolean = false;
  mensaje: string = '';
  visibilidadCarta: boolean = false;
  primeraRonda: boolean = true;
  terminoJuego: boolean = false;
  empezoJuego: boolean = false;
  cartasCargadas: boolean = false;
  cartasRestantes: number = 52;
  dorsoCarta: string = 'https://deckofcardsapi.com/static/img/back.png';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.initializeDeck();
  }

  initializeDeck(): void {
    this.cardService.crearMazo().subscribe((response) => {
      this.mazoID = response.deck_id;
      this.noMasCartas = false;
      this.puntosJugador = 0;
      this.puntosIA = 0;
      this.mensaje = '';
      this.visibilidadCarta = false;
      this.primeraRonda = true;
      this.terminoJuego = false;
      this.empezoJuego = false;
      this.cartasCargadas = false;
      this.cartasRestantes = 52; // Reiniciamos la cantidad de cartas
    });
  }

  startGame(): void {
    this.empezoJuego = true;
    this.visibilidadCarta = false;
    this.primeraRonda = true;
    this.cartasCargadas = false;
  }

  eleccionJugador(eleccion: 'alto' | 'igual' | 'bajo'): void {
    if (!this.mazoID || this.terminoJuego || !this.empezoJuego) return;

    this.visibilidadCarta = false;
    this.primeraRonda = false;

    // Hacemos la solicitud de las cartas
    this.cardService.repartirCartas(this.mazoID).subscribe((response) => {
      if (response.cards.length === 0 || this.cartasRestantes < 2) {
        this.noMasCartas = true;
        this.declararGanador();
        return;
      }

      this.cartaUno = response.cards[0];
      this.cartaDos = response.cards[1];

      this.cartasCargadas = true;

      const card1Value = this.getValorCarta(this.cartaUno.value);
      const card2Value = this.getValorCarta(this.cartaDos.value);

      let esCorrecto = false;

      if (eleccion === 'alto' && card2Value > card1Value) {
        esCorrecto = true;
      } else if (eleccion === 'igual' && card2Value === card1Value) {
        esCorrecto = true;
      } else if (eleccion === 'bajo' && card2Value < card1Value) {
        esCorrecto = true;
      }

      if (esCorrecto) {
        this.puntosJugador++;
      } else {
        this.puntosIA++;
      }

      this.visibilidadCarta = true;

      // Actualizamos el número de cartas restantes
      this.cartasRestantes -= 2;

      // Si ya no quedan suficientes cartas para otra ronda, terminamos el juego
      if (this.cartasRestantes < 2) {
        this.noMasCartas = true;
        this.declararGanador(); // Permitimos que juegue la última ronda completa
      }
    });
  }

  getValorCarta(value: string): number {
    if (value === 'ACE') return 14;
    if (value === 'KING') return 13;
    if (value === 'QUEEN') return 12;
    if (value === 'JACK') return 11;
    return parseInt(value, 10);
  }

  declararGanador(): void {
    this.terminoJuego = true;

    if (this.puntosJugador > this.puntosIA) {
      this.mensaje = `¡Ganaste! Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    } else if (this.puntosJugador < this.puntosIA) {
      this.mensaje = `¡Perdiste! Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    } else {
      this.mensaje = `¡Empate! Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    }

    // Deshabilitar los botones después de la última mano
    this.empezoJuego = false;
  }

  handleNewDeck(): void {
    this.initializeDeck();
  }
}
