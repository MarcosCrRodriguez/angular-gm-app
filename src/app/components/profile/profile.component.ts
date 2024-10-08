import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  public usuarioLogueado: any = null;
  public userData: any; // Aquí guardamos los datos del usuario
  public rankAhorcado: any;
  public rankMayorMenor: any;
  public rankPreguntados: any;
  public rankGenerala: any;
  public msjError: string = '';
  public sub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado en ProfileComponent:', usuario.email);
        this.usuarioLogueado = usuario;

        // Ahora nos suscribimos al observable que trae los datos opcionales
        this.authService
          .getUserRegistrado(this.usuarioLogueado.email)
          .subscribe((userData) => {
            if (userData) {
              this.userData = userData;
            } else {
              console.log(
                'No se encontraron datos opcionales para este usuario.'
              );
            }
          });

        this.authService
          .getRankingUsuarioEspecifico(this.usuarioLogueado.email, 'ahorcado')
          .subscribe((rankAhorcado) => {
            if (rankAhorcado) {
              this.rankAhorcado = rankAhorcado;
            } else {
              console.log(
                'No se encontraron datos opcionales para este usuario.'
              );
            }
          });
        this.authService
          .getRankingUsuarioEspecifico(
            this.usuarioLogueado.email,
            'mayor-menor'
          )
          .subscribe((rankMayorMenor) => {
            if (rankMayorMenor) {
              this.rankMayorMenor = rankMayorMenor;
            } else {
              console.log(
                'No se encontraron datos opcionales para este usuario.'
              );
            }
          });
        this.authService
          .getRankingUsuarioEspecifico(
            this.usuarioLogueado.email,
            'preguntados'
          )
          .subscribe((rankPreguntados) => {
            if (rankPreguntados) {
              this.rankPreguntados = rankPreguntados;
            } else {
              console.log(
                'No se encontraron datos opcionales para este usuario.'
              );
            }
          });
        this.authService
          .getRankingUsuarioEspecifico(this.usuarioLogueado.email, 'generala')
          .subscribe((rankGenerala) => {
            if (rankGenerala) {
              this.rankGenerala = rankGenerala;
            } else {
              console.log(
                'No se encontraron datos opcionales para este usuario.'
              );
            }
          });
      } else {
        console.log('No hay usuario logueado');
      }
    });

    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción para evitar fugas de memoria
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  volverHome() {
    this.router.navigate(['/home']);
  }
}
