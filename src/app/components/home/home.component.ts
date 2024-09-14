import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  quienSoy() {
    this.router.navigate(['/quien-soy']);
  }

  // ingresoAhorcado() {
  //   this.router.navigate(['/juegos/ahorcado']);
  // }
  ingresoAhorcado() {
    this.router.navigate(['ahorcado']);
  }

  // ingresoMayorMenor() {
  //   this.router.navigate(['/juegos/mayor-menor']);
  // }
  ingresoMayorMenor() {
    this.router.navigate(['mayor-menor']);
  }

  // ingresoPreguntados() {
  //   this.router.navigate(['/juegos/preguntados']);
  // }
  ingresoPreguntados() {
    this.router.navigate(['preguntados']);
  }

  // ingresoGenerala() {
  //   this.router.navigate(['/juegos/generala']);
  // }
  ingresoGenerala() {
    this.router.navigate(['generala']);
  }
}
