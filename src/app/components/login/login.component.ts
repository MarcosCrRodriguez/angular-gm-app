import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import {
  addDoc,
  collection,
  Firestore,
  where,
  query,
  limit,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from '@firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public title = 'Login';
  public userIngresado!: string;
  public claveIngresado!: string;
  public msjError: string = '';
  public txtPrimero = 'Usuario';
  public txtSegundo = 'Contraseña';

  constructor(private authService: AuthService, private router: Router) {
    this.userIngresado = '';
    this.claveIngresado = '';
  }

  login() {
    this.authService
      .login(this.userIngresado, this.claveIngresado)
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

  registro() {
    this.router.navigate(['/registro']);
  }
}
