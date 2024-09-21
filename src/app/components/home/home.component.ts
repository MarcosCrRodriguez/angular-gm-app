import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public usuarioLogueado: any = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuarioLogueado$.subscribe((user) => {
      this.usuarioLogueado = user;
      console.log(`${this.usuarioLogueado.email} esta en el home (⌐■_■)`);
    });

    window.scrollTo(0, 0);
  }

  quienSoy() {
    this.router.navigate(['/quien-soy']);
  }

  ingresarAhorcado() {
    if (this.usuarioLogueado) {
      this.router.navigate(['juegos', 'ahorcado']);
    } else {
      this.authService.mostrarMsjAdvertencia();
    }
  }

  ingresarMayorMenor() {
    if (this.usuarioLogueado) {
      this.router.navigate(['juegos', 'mayor-menor']);
    } else {
      this.authService.mostrarMsjAdvertencia();
    }
  }

  ingresarPreguntados() {
    if (this.usuarioLogueado) {
      this.router.navigate(['juegos', 'preguntados']);
    } else {
      this.authService.mostrarMsjAdvertencia();
    }
  }

  ingresarGenerala() {
    if (this.usuarioLogueado) {
      this.router.navigate(['juegos', 'generala']);
    } else {
      this.authService.mostrarMsjAdvertencia();
    }
  }
}
