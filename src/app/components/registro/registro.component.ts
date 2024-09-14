import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component, OnInit } from '@angular/core';
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
export class RegistroComponent implements OnInit {
  public title = 'Registro';
  public txtPrimero = 'Nombre';
  public txtSegundo = 'Apellido';
  public txtTercero = 'Edad';
  // public txtCuarto = 'Dia';
  // public txtQuinto = 'Mes';
  // public txtSexto = 'Año';
  public txtSeptimo = 'Correo';
  public txtOctavo = 'Contraseña';

  public userIngresado!: string;
  public claveIngresado!: string;
  public nombreIngresado!: string;
  public apellidoIngresado!: string;
  public edadIngresada!: string;
  // public diaIngresado!: number;
  // public mesIngresado!: number;
  // public anioIngresado!: number;

  public msjError: string = '';
  public msjNombre: string = '';
  public msjApellido: string = '';
  public msjEdad: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.userIngresado = '';
    this.claveIngresado = '';
    this.nombreIngresado = '';
    this.apellidoIngresado = '';
    this.edadIngresada = '';

    this.msjNombre = 'Nombre completo del usuario';
    this.msjApellido = 'Apellido completo del usuario';
    this.msjEdad = 'La edad del usuario debe ser mayor a 18';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  verificarLargoCadena(cadena: string, tipo: string): string {
    if ((cadena.length > 2 && cadena.length < 17) || cadena === '') {
      return 'Correctamente Ingresado';
    } else {
      return `El ${tipo} ingresado debe tener entre 3 y 16 caracteres`;
    }
  }

  verificarNumero(numero: string, tipo: string) {
    if (numero === '') {
      return 'Correctamente Ingresado';
    }
    const numericAge = Number(numero);
    if (isNaN(numericAge)) {
      return `La ${tipo} ingresada debe ser un número`;
    } else if (numericAge < 18 || numericAge > 99) {
      return `La ${tipo} ingresada debe tener entre 18 y 99 años`;
    } else {
      return 'Correctamente Ingresado';
    }
  }

  register() {
    this.msjNombre = this.verificarLargoCadena(this.nombreIngresado, 'Nombre');
    this.msjApellido = this.verificarLargoCadena(
      this.apellidoIngresado,
      'Apellido'
    );
    this.msjEdad = this.verificarNumero(this.edadIngresada, 'Edad');
    console.log(this.msjNombre, this.msjApellido, this.msjEdad);
    if (
      this.msjNombre === 'Correctamente Ingresado' &&
      this.msjApellido === 'Correctamente Ingresado' &&
      this.msjEdad === 'Correctamente Ingresado'
    ) {
      this.authService
        .register(this.userIngresado, this.claveIngresado)
        .then(() => {
          if (
            this.nombreIngresado &&
            this.apellidoIngresado &&
            this.edadIngresada
          ) {
            console.log('Se cagragon los datos opcionales correctamente');
          } else {
            Toastify({
              text: 'Algunos datos opcionales no fueron proporcionados',
              duration: 4000,
              close: true,
              gravity: 'top',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
            }).showToast();
          }
          this.authService.optionalRegisterData(
            this.userIngresado,
            this.nombreIngresado,
            this.apellidoIngresado,
            this.edadIngresada
          );
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
          this.nombreIngresado = '';
          this.apellidoIngresado = '';
          this.edadIngresada = '';
        });
    } else {
      Toastify({
        text: 'Reingrese los datos opcionales',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  }

  loguear() {
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
