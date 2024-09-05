import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public title = 'Login';
  public nombreUser = 'JuanCarlos';
  public claveUser = '13249';
  public txtPrimero = 'Usuario';
  public txtSegundo = 'Contraseña';

  public userIngresado!: string;
  public claveIngresado!: string;

  public usuario!: Usuario;

  constructor(private router: Router) {}

  loguear() {
    this.usuario = new Usuario(this.userIngresado, this.claveIngresado);

    if (
      this.userIngresado === this.nombreUser &&
      this.claveIngresado === this.claveUser
    ) {
      this.router.navigate(['/bienvenido'], {
        state: { usuario: this.usuario },
      });
    } else {
      Toastify({
        text: '¡Error! Los datos de la cuenta son incorrectos',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        className: 'error-toast',
      }).showToast();

      this.router.navigate(['/error'], {
        state: { error: 'al intentar iniciar sesion' },
      });
    }
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
