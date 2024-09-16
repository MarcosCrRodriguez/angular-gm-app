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

  ingresoAhorcado() {
    this.router.navigate(['juegos', 'ahorcado']);
  }

  ingresoMayorMenor() {
    this.router.navigate(['juegos', 'mayor-menor']);
  }

  ingresoPreguntados() {
    this.router.navigate(['juegos', 'preguntados']);
  }

  ingresoGenerala() {
    this.router.navigate(['juegos', 'generala']);
  }
}
