import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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
  public accessoRapidoUser = 'piedecamello@gmail.com';
  public accessoRapidoPassword = 'piedecamello';

  constructor(private authService: AuthService, private router: Router) {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  accessoRapido() {
    this.userIngresado = this.accessoRapidoUser;
    this.claveIngresado = this.accessoRapidoPassword;
  }

  limpiarInputs() {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  login() {
    this.authService
      .login(this.userIngresado, this.claveIngresado)
      .catch((error: string) => {
        this.msjError = error;
        this.contError += 1;

        Toastify({
          text: this.msjError,
          duration: 4000,
          close: true,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();

        if (this.contError == this.limitErrors) {
          this.router.navigate(['/error'], {
            state: { error: 'Llegaste al limite de intentos' },
          });
        }

        this.userIngresado = '';
        this.claveIngresado = '';
      });
  }

  registro() {
    this.router.navigate(['/registro']);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
