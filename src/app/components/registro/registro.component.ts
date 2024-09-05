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
  public txtTercero = 'Edad';
  public txtCuarto = 'Dia';
  public txtQuinto = 'Mes';
  public txtSexto = 'Año';
  public txtSeptimo = 'Usuario';
  public txtOctavo = 'Contraseña';

  public userIngresado!: string;
  public claveIngresado!: string;
  public edadIngresado!: number;
  public diaIngresado!: number;
  public mesIngresado!: number;
  public anioIngresado!: number;
  public usuarioIngresado!: string;
  public contraseniaIngresado!: string;

  constructor(private router: Router) {}

  registrar() {}

  loguear() {
    this.router.navigate(['/login']);
  }
}
