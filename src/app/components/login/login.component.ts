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

      this.authService.loguear(usuarioValido);

      this.router.navigate(['/home']);
    } else {
      Toastify({
        text: '¡Error! Los datos de la cuenta son incorrectos',
        duration: 4000,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();

      this.router.navigate(['/error'], {
        state: {
          error: 'Error al intentar iniciar sesion - cuenta no existente',
        },
      });
    }
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
