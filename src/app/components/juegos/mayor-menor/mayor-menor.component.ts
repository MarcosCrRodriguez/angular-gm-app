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
  public mazoID: string = '';
  public cartaUno: any = null;
  public cartaDos: any = null;
  public puntosJugador: number = 0;
  public puntosIA: number = 0;
  public noMasCartas: boolean = false;
  public mensaje: string = '';
  public resultado: string = '';
  public visibilidadCarta: boolean = false;
  public primeraRonda: boolean = true;
  public terminoJuego: boolean = false;
  public empezoJuego: boolean = false;
  public cartasCargadas: boolean = false;
  public cartasRestantes: number = 52;
  public dorsoCarta: string = 'https://deckofcardsapi.com/static/img/back.png';

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
      this.resultado = '';
      this.visibilidadCarta = false;
      this.primeraRonda = true;
      this.terminoJuego = false;
      this.empezoJuego = false;
      this.cartasCargadas = false;
      this.cartasRestantes = 52;
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

    this.cardService.repartirCartas(this.mazoID).subscribe((response) => {
      if (response.cards.length === 0 || this.cartasRestantes < 2) {
        this.noMasCartas = true;
        this.declararGanador();
        return;
      }

      this.cartaUno = response.cards[0];
      this.cartaDos = response.cards[1];

      this.cartasCargadas = true;

      const cardUnoValue = this.getValorCarta(this.cartaUno.value);
      const cardDosValue = this.getValorCarta(this.cartaDos.value);

      let esCorrecto = false;

      if (eleccion === 'alto' && cardDosValue > cardUnoValue) {
        esCorrecto = true;
      } else if (eleccion === 'igual' && cardDosValue === cardUnoValue) {
        esCorrecto = true;
      } else if (eleccion === 'bajo' && cardDosValue < cardUnoValue) {
        esCorrecto = true;
      }

      if (esCorrecto) {
        this.puntosJugador++;
      } else {
        this.puntosIA++;
      }

      this.visibilidadCarta = true;

      this.cartasRestantes -= 2;

      if (this.cartasRestantes < 2) {
        this.noMasCartas = true;
        this.declararGanador();
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
      this.mensaje = '¡Ganaste!';
      this.resultado = `Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    } else if (this.puntosJugador < this.puntosIA) {
      this.mensaje = '¡Perdiste!';
      this.resultado = `Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    } else {
      this.mensaje = '¡Empate!';
      this.resultado = `Puntaje: Jugador ${this.puntosJugador} - Máquina ${this.puntosIA}`;
    }

    this.empezoJuego = false;
  }

  handleNewDeck(): void {
    this.initializeDeck();
  }
}
