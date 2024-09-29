import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resp-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resp-usuarios.component.html',
  styleUrl: './resp-usuarios.component.css',
})
export class RespUsuariosComponent {
  public usuarioLogueado: any = null;
  encuesta: any = null;
  usuario: string = '';
  public mensajeError: string = '';
  public sub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        this.usuarioLogueado = usuario;
      }
    });

    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  filtrarEncuesta() {
    if (this.usuario) {
      this.authService.getEncuestaRegistrada(this.usuario).subscribe(
        (data) => {
          this.encuesta = data;
        },
        (error) => {
          console.error('Error al filtrar encuesta:', error);
        }
      );
    }
  }

  volverEncuestas() {
    this.router.navigate(['/encuesta']);
  }
}
