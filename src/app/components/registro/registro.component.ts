import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  public title = 'Registro';
  public txtPrimero = 'Nombre';
  public txtSegundo = 'Apellido';
  public txtTercero = 'Edad';
  public txtCuarto = 'Dia';
  public txtQuinto = 'Mes';
  public txtSexto = 'Año';
  public txtSeptimo = 'Usuario';
  public txtOctavo = 'Contraseña';

  public userIngresado!: string;
  public claveIngresado!: string;
  public nombreIngresado!: string;
  public apellidoIngresado!: string;
  public edadIngresada!: number;
  public diaIngresado!: number;
  public mesIngresado!: number;
  public anioIngresado!: number;

  public msjError: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  register() {
    this.authService
      .register(this.userIngresado, this.claveIngresado)
      .then(() => {
        this.userIngresado = '';
        this.claveIngresado = '';
      })
      .catch((error: string) => {
        this.msjError = error;

        Toastify({
          text: this.msjError,
          duration: 4000,
          close: true,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();

        this.userIngresado = '';
        this.claveIngresado = '';
      });
  }

  loguear() {
    this.router.navigate(['/login']);
  }
}
