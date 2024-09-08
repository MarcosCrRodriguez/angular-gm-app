import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  visibleAhorcadoTxt: boolean = false;
  visibleMayorMenorTxt: boolean = false;
  visiblePreguntadosTxt: boolean = false;
  visibleGeneralaTxt: boolean = false;
  txtButtonA: string = 'Mostrar Más';
  txtButtonB: string = 'Mostrar Más';
  txtButtonC: string = 'Mostrar Más';
  txtButtonD: string = 'Mostrar Más';

  constructor(private router: Router) {}

  quienSoy() {
    this.router.navigate(['/quien-soy']);
  }

  toggleAhorcadoTxt(): void {
    this.visibleAhorcadoTxt = !this.visibleAhorcadoTxt;
    this.txtButtonA = this.visibleAhorcadoTxt ? 'Mostrar Menos' : 'Mostrar Más';
  }

  toggleMayorMenorTxt(): void {
    this.visibleMayorMenorTxt = !this.visibleMayorMenorTxt;
    this.txtButtonB = this.visibleMayorMenorTxt
      ? 'Mostrar Menos'
      : 'Mostrar Más';
  }

  togglePreguntadosTxt(): void {
    this.visiblePreguntadosTxt = !this.visiblePreguntadosTxt;
    this.txtButtonC = this.visiblePreguntadosTxt
      ? 'Mostrar Menos'
      : 'Mostrar Más';
  }

  toggleGeneralaTxt(): void {
    this.visibleGeneralaTxt = !this.visibleGeneralaTxt;
    this.txtButtonD = this.visibleGeneralaTxt ? 'Mostrar Menos' : 'Mostrar Más';
  }
}
