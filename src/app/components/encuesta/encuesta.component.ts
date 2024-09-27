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
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css',
})
export class EncuestaComponent implements OnInit {
  form!: FormGroup;
  public showLoadingGif = false;
  public usuarioLogueado: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log(`${usuario.email} ingreso a encuesta`);
      }
      this.usuarioLogueado = usuario;
    });
    this.form = new FormGroup({
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
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
      disfrutaPagina: new FormControl('', Validators.required),
      juegosJugados: new FormControl([], Validators.required),
      juegoMasGustado: new FormControl('', Validators.required),
      juegoMenosGustado: new FormControl('', Validators.required),
      comentario: new FormControl('', Validators.required),
    });
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

  get telefono() {
    return this.form.get('telefono');
  }

  get disfrutaPagina() {
    return this.form.get('disfrutaPagina');
  }

  get juegosJugados() {
    return this.form.get('juegosJugados');
  }

  get juegoMasGustado() {
    return this.form.get('juegoMasGustado');
  }

  get juegoMenosGustado() {
    return this.form.get('juegoMenosGustado');
  }

  get comentario() {
    return this.form.get('comentario');
  }

  subirEncuesta() {
    if (this.form.valid) {
      this.showLoadingGif = true;
      const {
        nombre,
        apellido,
        edad,
        telefono,
        disfrutaPagina,
        juegosJugados,
        juegoMasGustado,
        juegoMenosGustado,
        comentario,
      } = this.form.value;

      const email = this.usuarioLogueado.email;

      this.authService.registroEncuesta({
        email,
        nombre,
        apellido,
        edad,
        telefono,
        disfrutaPagina,
        juegosJugados,
        juegoMasGustado,
        juegoMenosGustado,
        comentario,
      });

      setTimeout(() => {
        this.showLoadingGif = false;
        this.form.reset();
        Swal.fire({
          title: 'Éxito',
          text: '¡La Encuesta fue cargada con éxito! ',
          icon: 'success',
          background: '#fff',
          backdrop: 'rgba(0, 123, 0, 0)',
          timer: 4000,
          timerProgressBar: true,
        });
        this.router.navigate(['/home']);
      }, 5000);
    } else {
      let errorMessage = 'Revisa los campos del formulario:';
      if (this.nombre?.hasError('required')) {
        errorMessage += '\n - El nombre es obligatorio.';
      }
      if (this.apellido?.hasError('required')) {
        errorMessage += '\n - El apellido es obligatorio.';
      }
      if (this.edad?.hasError('required')) {
        errorMessage += '\n - La edad es obligatoria.';
      }
      if (this.telefono?.hasError('required')) {
        errorMessage += '\n - El teléfono es obligatorio.';
      }
      if (this.form.get('disfrutaPagina')?.hasError('required')) {
        errorMessage +=
          '\n - El campo "¿Disfruta del uso de la página?" es obligatorio.';
      }
      if (this.form.get('juegosJugados')?.hasError('required')) {
        errorMessage += '\n - Al menos un juego debe ser seleccionado.';
      }
      if (this.juegoMasGustado?.hasError('required')) {
        errorMessage += '\n - El juego que más le gustó es obligatorio.';
      }
      if (this.juegoMenosGustado?.hasError('required')) {
        errorMessage += '\n - El juego que menos le gustó es obligatorio.';
      }
      if (this.comentario?.hasError('required')) {
        errorMessage += '\n - El comentario es obligatorio.';
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

  onCheckboxChange(event: any) {
    const checkArray: any = this.form.get('juegosJugados');
    if (event.target.checked) {
      checkArray.setValue([...checkArray.value, event.target.value]);
    } else {
      const index = checkArray.value.indexOf(event.target.value);
      checkArray.setValue([
        ...checkArray.value.slice(0, index),
        ...checkArray.value.slice(index + 1),
      ]);
    }
  }
}
