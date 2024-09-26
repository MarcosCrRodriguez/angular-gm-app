import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { confirmarCalveValidator } from '../../models/clave.validator';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  form!: FormGroup;
  public showLoadingGif = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ]),
        nombre: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.minLength(3),
          Validators.maxLength(16),
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.minLength(3),
          Validators.maxLength(16),
        ]),
        edad: new FormControl('', [
          Validators.required,
          Validators.min(18),
          Validators.max(99),
        ]),
        clave: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        repiteClave: new FormControl('', Validators.required),
      },
      confirmarCalveValidator()
    );
  }

  get email() {
    return this.form.get('email');
  }
  get nombre() {
    return this.form.get('nombre');
  }
  get apellido() {
    return this.form.get('apellido');
  }
  get edad() {
    return this.form.get('edad');
  }
  get clave() {
    return this.form.get('clave');
  }
  get repiteClave() {
    return this.form.get('repiteClave');
  }

  registrar() {
    if (this.form.valid) {
      this.showLoadingGif = true;
      const { email, clave, nombre, apellido, edad } = this.form.value;
      this.authService
        .register(email, clave)
        .then(() => {
          this.authService.optionalRegisterData(email, nombre, apellido, edad);
          Swal.fire({
            title: 'Éxito',
            text: '¡Usuario registrado correctamente!',
            icon: 'success',
            timer: 4000,
            timerProgressBar: true,
          });
          this.router.navigate(['/home']);
        })
        .catch((error: string) => {
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            timer: 4000,
            timerProgressBar: true,
          });
          this.showLoadingGif = false;
        });
    } else {
      let errorMessage = 'Revisa los campos del formulario:';
      if (this.email?.hasError('required')) {
        errorMessage += '\n - El correo electrónico es obligatorio.';
      }
      if (this.email?.hasError('pattern')) {
        errorMessage +=
          '\n - Formato de correo inválido. Ejemplo: nombre@dominio.com';
      }
      if (this.nombre?.hasError('required')) {
        errorMessage += '\n - El nombre es obligatorio.';
      }
      if (this.apellido?.hasError('required')) {
        errorMessage += '\n - El apellido es obligatorio.';
      }
      if (this.edad?.hasError('min')) {
        errorMessage += '\n - Debes ser mayor de 18 años.';
      }
      if (this.clave?.hasError('minlength')) {
        errorMessage += `\n - La clave debe tener mínimo ${
          this.clave?.getError('minlength').requiredLength
        } caracteres.`;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        timer: 4000,
        timerProgressBar: true,
      });
    }
  }

  loguear() {
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/home']);
  }
}
