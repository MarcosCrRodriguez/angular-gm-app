import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// indica que el servicio -> singleton y se proporciona en el nivel raíz de la aplicación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);
  private usuarioLogueado = new BehaviorSubject<User | null>(null);
  usuarioLogueado$ = this.usuarioLogueado.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // Monitorea el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado.next(user); // Actualiza el usuario logueado
    });
  }

  // Función para loguear usuarios
  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.logUserActivity(res.user.email!); // Guardar log
        this.router.navigate(['/home']); // Redireccionar al home
      })
      .catch((error) => {
        return Promise.reject(this.getErrorMessage(error.code));
      });
  }

  // Función para registrar un usuario
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.logUserActivity(res.user.email!); // Guardar log
        this.router.navigate(['/login']); // Redireccionar al login
      })
      .catch((error) => {
        return Promise.reject(this.getErrorMessage(error.code));
      });
  }

  // Cerrar sesión
  closeSession(): Promise<void> {
    return signOut(this.auth);
  }

  // Cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Obtener el estado actual del usuario logueado
  getUsuarioLogueado(): User | null {
    return this.usuarioLogueado.value;
  }

  // Guardar logs de usuarios en Firebase
  private logUserActivity(email: string) {
    const col = collection(this.firestore, 'logins');
    addDoc(col, { fecha: new Date(), user: email });
  }

  // Manejar mensajes de error de Firebase
  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return '¡Credenciales inválidas!';
      case 'auth/invalid-email':
        return '¡El email ingresado es inválido!';
      case 'auth/email-already-in-use':
        return '¡El email ingresado ya está en uso!';
      case 'auth/weak-password':
        return '¡Contraseña débil! Debe tener más de 6 caracteres.';
      default:
        return 'Error desconocido: ' + code;
    }
  }
}
