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
  public puntos: number = 0;
  public cargando: boolean = false;
  public dorsoCarta: string = 'https://deckofcardsapi.com/static/img/back.png';
  public mensajeResultado: string = '';
  public botonesDeshabilitados: boolean = false;
  public cartaAnterior: any = null;
  public esPrimeraRonda: boolean = true;

  constructor(private cartaService: CardService) {}

  ngOnInit(): void {
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
    this.sacarDosCartas();
  }

  sacarDosCartas(): void {
    if (!this.idMazo) {
      console.log('No se ha creado un mazo.');
      return;
    }

    this.cartaService.sacarDosCartas(this.idMazo).subscribe((respuesta) => {
      if (respuesta.cards.length === 2) {
        if (this.esPrimeraRonda) {
          this.cartaAnterior = { image: this.dorsoCarta };
          this.esPrimeraRonda = false;
        } else {
          this.cartaAnterior = this.cartaActual;
        }

        this.cartaActual = respuesta.cards[0];
        this.cartaSiguiente = respuesta.cards[1];
        this.cartasRestantes = respuesta.remaining - 2;
        this.cargando = false;
        this.mensajeResultado = '';
      } else {
        console.log('No se pudieron sacar las dos cartas.');
      }
    });
  }

  sacarCarta(): void {
    if (!this.idMazo) {
      console.log('No se ha creado un mazo.');
      return;
    }

    this.cartaService.sacarCarta(this.idMazo).subscribe((respuesta) => {
      if (respuesta.cards.length > 0) {
        this.cartaSiguiente = respuesta.cards[0];
        this.cartasRestantes = respuesta.remaining;
        this.cargando = false;
      } else {
        console.log('No se pudieron sacar cartas.');
      }
    });
  }

  delay(milisegundos: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milisegundos));
  }

  async eleccionJugador(opcion: string): Promise<void> {
    if (this.cartasRestantes > 0) {
      if (this.cartaActual && this.cartaSiguiente) {
        this.botonesDeshabilitados = true;

        await this.delay(500);

        const resultadoCorrecto = this.evaluarResultado(opcion);
        if (resultadoCorrecto) {
          this.puntos++;
          this.mensajeResultado = '¡Acertaste!';
        } else {
          this.mensajeResultado = '¡Fallaste!';
        }

        this.cartaAnterior = this.cartaActual;
        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = null;
        this.sacarCarta();

        this.botonesDeshabilitados = false;
      } else {
        console.log('No se pueden evaluar las cartas porque faltan cartas.');
      }
    } else {
      console.log('No quedan más cartas en el mazo');
    }
  }

  evaluarResultado(opcion: string): boolean {
    const valorActual = this.obtenerValorCarta(this.cartaActual.value);
    const valorSiguiente = this.obtenerValorCarta(this.cartaSiguiente.value);

    if (opcion === 'alto' && valorActual > valorSiguiente) {
      return true;
    } else if (opcion === 'bajo' && valorActual < valorSiguiente) {
      return true;
    } else if (opcion === 'igual' && valorActual === valorSiguiente) {
      return true;
    }
    return false;
  }

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
    this.cartaService.crearMazo().subscribe((respuesta) => {
      this.idMazo = respuesta.deck_id;
      this.cartasRestantes = respuesta.remaining;
    });
  }
}
