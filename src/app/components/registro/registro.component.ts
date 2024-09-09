import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  public txtTercero = 'Email';
  public txtCuarto = 'Dia';
  public txtQuinto = 'Mes';
  public txtSexto = 'Año';
  public txtSeptimo = 'Usuario';
  public txtOctavo = 'Contraseña';

  public userIngresado!: string;
  public claveIngresado!: string;
  public nombreIngresado!: string;
  public apellidoIngresado!: string;
  public mailIngresado!: string;
  public diaIngresado!: number;
  public mesIngresado!: number;
  public anioIngresado!: number;

  constructor(private router: Router) {}

  registrar() {
    if (
      this.userIngresado &&
      this.claveIngresado &&
      this.nombreIngresado &&
      this.apellidoIngresado &&
      this.mailIngresado
    ) {
      const usuario = {
        username: this.userIngresado,
        password: this.claveIngresado,
        nombre: this.nombreIngresado,
        apellido: this.apellidoIngresado,
        email: this.mailIngresado,
      };

      // Obtener usuarios existentes del localStorage
      const usuariosGuardados = JSON.parse(
        localStorage.getItem('usuarios') || '[]'
      );

      // Agregar el nuevo usuario a la lista
      usuariosGuardados.push(usuario);

      // Guardar la lista actualizada en localStorage
      localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

      Toastify({
        text: '¡Su cuenta se registro correctamente!',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #1c25d1, #23c620)',
      }).showToast();

      this.router.navigate(['/login']);
    } else {
      Toastify({
        text: '¡Error! Complete todos los campos ',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        className: 'error-toast',
      }).showToast();
    }
  }

  loguear() {
    this.router.navigate(['/login']);
  }
}
