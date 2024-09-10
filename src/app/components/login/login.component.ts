import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  public try = 0;

  public userIngresado!: string;
  public claveIngresado!: string;

  public usuario!: Usuario;

  constructor(private authService: AuthService, private router: Router) {}

  loguear() {
    // Obtener los usuarios registrados desde el localStorage
    const usuariosGuardados = JSON.parse(
      localStorage.getItem('usuarios') || '[]'
    );

    // podría pasarlo a una funcion en el authService
    // Verificar si las credenciales coinciden con algún usuario guardado
    const usuarioValido = usuariosGuardados.find((user: any) => {
      return (
        user.username === this.userIngresado &&
        user.password === this.claveIngresado
      );
    });

    if (usuarioValido) {
      Toastify({
        text: '¡Se logeo correctamente!',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #1c25d1, #23c620)',
      }).showToast();

      this.try = 0;
      this.authService.loguear(usuarioValido);

      this.router.navigate(['/home']);
    } else {
      Toastify({
        text: '¡Error! La cuenta ingresada no existe ',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();

      if (this.try == 5) {
        this.try = 0;
        this.router.navigate(['/error'], {
          state: { error: 'Límites de intentos alcanzados' },
        });
      }

      this.try += 1;
      this.userIngresado = '';
      this.claveIngresado = '';
    }
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
