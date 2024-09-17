import { Component, OnInit } from '@angular/core';
import { CardService } from './../../../services/card.service';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css',
})
export class MayorMenorComponent implements OnInit {
  public mazoCompleto: any[] = [];
  public cartaActual: any = null;
  public cartaSiguiente: any = null;
  public juegoIniciado: boolean = false;
  public cartasRestantes: number = 0;
  public puntos: number = 0;
  public cargando: boolean = false;
  public mensajeResultado: string = '';
  public botonesDeshabilitados: boolean = false;
  public cartaAnterior: any = null;
  public esPrimeraRonda: boolean = true;
  public rankingData: any;
  public usuarioLogueado: any = null;
  public dorsoCarta: string = 'https://deckofcardsapi.com/static/img/back.png';
  public idMazo: string = '';

  constructor(
    private cartaService: CardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartaService.obtenerMazoCompleto().subscribe((respuesta) => {
      this.mazoCompleto = respuesta.cards;
      this.cartasRestantes = this.mazoCompleto.length;
      this.idMazo = respuesta.deck_id;
      console.log(this.cartasRestantes);
    });

    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email);
      }
      this.usuarioLogueado = usuario;
    });

    this.authService.getRankingJuegos('mayor-menor').subscribe((data) => {
      this.rankingData =
        data ||
        console.log('No se encontraron datos opcionales para este usuario.');
    });

    window.scrollTo(0, 0);
  }

  iniciarJuego(): void {
    this.cargando = true;
    setTimeout(() => {
      this.juegoIniciado = true;
      this.cargarPrimerasCartas();
    }, 3000);
  }

  cargarPrimerasCartas(): void {
    if (this.mazoCompleto.length >= 2) {
      if (this.esPrimeraRonda) {
        this.cartaAnterior = { image: this.dorsoCarta };
        this.esPrimeraRonda = false;
      } else {
        this.cartaAnterior = this.cartaActual;
      }

      this.cartaActual = this.mazoCompleto.shift();
      this.cartaSiguiente = this.mazoCompleto.shift();
      this.cartasRestantes -= 2;
      // console.log(`Cartas restantes: ${this.cartasRestantes}`);
      this.cargando = false;
    }
  }

  sacarCarta(): void {
    if (this.mazoCompleto.length > 0) {
      this.cartaSiguiente = this.mazoCompleto.shift();
      this.cartasRestantes--;
      // console.log(`Cartas restantes: ${this.cartasRestantes}`);
      if (this.cartasRestantes === 0 && this.usuarioLogueado?.email) {
        this.authService.scoreJuegos(
          this.usuarioLogueado.email,
          this.puntos,
          'mayor-menor'
        );
      }
    } else {
      console.log('No quedan más cartas en el mazo');
    }
  }

  async eleccionJugador(opcion: string): Promise<void> {
    if (this.cartasRestantes > 0) {
      if (this.cartaActual && this.cartaSiguiente) {
        this.botonesDeshabilitados = true;
        await this.delay(500);

        const resultadoCorrecto = this.evaluarResultado(opcion);
        this.mensajeResultado = resultadoCorrecto
          ? '¡Acertaste!'
          : '¡Fallaste!';
        if (resultadoCorrecto) this.puntos++;

        this.cartaAnterior = this.cartaActual;
        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = null;
        this.sacarCarta();

        this.botonesDeshabilitados = false;
      } else {
        console.log('Faltan cartas para continuar el juego.');
      }
    } else {
      console.log('No quedan más cartas en el mazo');
    }
  }

  delay(milisegundos: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milisegundos));
  }

  evaluarResultado(opcion: string): boolean {
    const valorActual = this.obtenerValorCarta(this.cartaActual.value);
    const valorSiguiente = this.obtenerValorCarta(this.cartaSiguiente.value);

    if (opcion === 'alto' && valorSiguiente > valorActual) {
      return true;
    } else if (opcion === 'bajo' && valorSiguiente < valorActual) {
      return true;
    } else if (opcion === 'igual' && valorSiguiente === valorActual) {
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

    this.cartaService.obtenerMazoCompleto().subscribe({
      next: (respuesta) => {
        this.mazoCompleto = respuesta.cards;
        this.cartasRestantes = this.mazoCompleto.length;
        this.idMazo = respuesta.deck_id;
      },
      error: (err) => {
        console.error('Error al obtener el mazo: ', err);
        this.mensajeResultado =
          'No se pudo obtener el mazo, intenta nuevamente.';
      },
    });
  }
}
