import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public title = 'Login';
  public txtPrimero = 'Usuario';
  public txtSegundo = 'Contraseña';
  public userIngresado!: string;
  public claveIngresado!: string;
  public msjError: string = '';
  public contError: number = 0;
  public limitErrors: number = 5;
  // public userQuickAcces = 'quicklogin@gmail.com';
  // public passwordUserQuickAcces = 'quicklogin';
  public slayerQuickAcces = 'doomslayer@hothell.com';
  public passwordSlayerQuickAcces = 'doomslayer';
  public showLoadingGif = false;

  constructor(private authService: AuthService, private router: Router) {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  // accessoRapidoUser() {
  //   this.userIngresado = this.userQuickAcces;
  //   this.claveIngresado = this.passwordUserQuickAcces;
  // }

  accessoRapidoSlayer() {
    this.userIngresado = this.slayerQuickAcces;
    this.claveIngresado = this.passwordSlayerQuickAcces;
  }

  limpiarInputs() {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  login() {
    this.showLoadingGif = true;
    this.authService
      .login(this.userIngresado, this.claveIngresado)
      .then(() => {
        setTimeout(() => {
          this.showLoadingGif = false;
          Swal.fire({
            title: 'Éxito',
            text: '¡Usuario logeado correctamente! ',
            icon: 'success',
            background: '#fff',
            backdrop: 'rgba(0, 123, 0, 0)',
            timer: 4000,
            timerProgressBar: true,
          });
          this.router.navigate(['/home']);
        }, 4000);
      })
      .catch((error: string) => {
        this.msjError = error;
        this.contError += 1;

        Swal.fire({
          title: 'Error',
          text: this.msjError,
          icon: 'error',
          background: '#fff',
          backdrop: 'rgba(0,0,123,0.3)',
          timer: 4000,
          timerProgressBar: true,
        });
        if (this.contError == this.limitErrors) {
          this.router.navigate(['/error'], {
            state: { error: 'Llegaste al límite de intentos' },
          });
        }

        // Limpiar los campos de entrada
        this.userIngresado = '';
        this.claveIngresado = '';

        // Asegurarse de que el GIF no se quede visible en caso de error
        this.showLoadingGif = false;
      });
  }

  registro() {
    this.router.navigate(['/registro']);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
