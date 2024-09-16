import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  updatePassword as firebaseUpdatePassword,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  where,
  query,
  limit,
  orderBy,
  getDoc,
  doc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioLogueado = new BehaviorSubject<User | null>(null);
  usuarioLogueado$ = this.usuarioLogueado.asObservable();
  private msjError: string = '';
  public loginCollection: any[] = [];
  private sub!: Subscription;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // Monitorea el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogueado.next(user);
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        Toastify({
          text: '¡Usuario logeado correctamente! ',
          duration: 4000,
          close: true,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #4caf50, #81c784)',
        }).showToast();
        this.logUserActivity(res.user.email!);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        return Promise.reject(this.getErrorMessage(error.code));
      });
  }

  // Función para registrar un usuario
  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.logUserActivity(res.user.email!);
        this.login(email, password);
      })
      .catch((error) => {
        return Promise.reject(this.getErrorMessage(error.code));
      });
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getUsuarioLogueado(): User | null {
    return this.usuarioLogueado.value;
  }

  getUserRegistrado(usuario: string): Observable<any> {
    let col = collection(this.firestore, 'registro');

    const filteredQuery = query(col, where('usuario', '==', usuario));

    return collectionData(filteredQuery).pipe(
      map((respuesta: any[]) => {
        if (respuesta.length > 0) {
          const userData = respuesta[0];
          return {
            usuario: userData.usuario,
            nombre: userData.nombre,
            apellido: userData.apellido,
            edad: userData.edad,
          };
        } else {
          return {
            usuario: usuario,
            nombre: 'No hay datos',
            apellido: 'No hay datos',
            edad: 'No hay datos',
          };
        }
      })
    );
  }

  getRankingUsuarioEspecifico(
    usuario: string,
    tipoJuego: string
  ): Observable<any> {
    let col = collection(this.firestore, tipoJuego);

    const filteredQuery = query(col, where('usuario', '==', usuario));

    return collectionData(filteredQuery).pipe(
      map((respuesta: any[]) => {
        if (respuesta.length > 0) {
          // Encontrar el valor más alto de puntos
          const maxPuntos = Math.max(
            ...respuesta.map((rankingData) => rankingData.puntos)
          );
          return {
            puntos: maxPuntos,
          };
        } else {
          return {
            puntos: 'Sin score cargado',
          };
        }
      })
    );
  }

  getRankingJuegos(tipoJuego: string): Observable<any> {
    let col = collection(this.firestore, tipoJuego);

    const filteredQuery = query(col, orderBy('puntos', 'desc'), limit(3));

    return collectionData(filteredQuery).pipe(
      map((respuesta: any[]) => {
        if (respuesta.length > 0) {
          return respuesta.map((userData) => ({
            usuario: userData.usuario,
            puntos: userData.puntos,
          }));
        } else {
          return [
            {
              usuario: 'No hay datos',
              puntos: 'No hay datos',
            },
          ];
        }
      })
    );
  }

  private logUserActivity(email: string) {
    const col = collection(this.firestore, 'logins');
    addDoc(col, { fecha: new Date(), user: email });
  }

  scoreJuegos(email: string, puntos: number, tipoJuego: string) {
    const col = collection(this.firestore, tipoJuego);
    addDoc(col, { fecha: new Date(), usuario: email, puntos: puntos });
    console.log('Registramos el puntaje en la DB');
  }

  optionalRegisterData(
    usuario: string,
    nombre: string,
    apellido: string,
    edad: string
  ) {
    const col = collection(this.firestore, 'registro');

    addDoc(col, {
      usuario: usuario || 'Desconocido',
      nombre: nombre || 'Desconocido',
      apellido: apellido || 'Desconocido',
      edad: edad || 'Desconocido',
    })
      .then(() => {
        console.log('Datos opcionales registrados exitosamente');
      })
      .catch((error) => {
        console.error('Error al registrar datos opcionales:', error);
      });
  }

  private getErrorMessage(ex: string): string {
    switch (ex) {
      case 'auth/invalid-credential':
        this.msjError = '¡Credenciales inválidas!';
        break;
      case 'auth/invalid-email':
        this.msjError = '¡El email ingresado es inválido!';
        break;
      case 'auth/email-already-in-use':
        this.msjError = '¡El email ingresado ya está en uso!';
        break;
      case 'auth/weak-password':
        this.msjError = '¡Contraseña débil! Debe tener más de 6 caracteres.';
        break;
      case 'auth/missing-password':
        this.msjError = '¡Credenciales inválidas!';
        break;
      default:
        this.msjError = 'Error desconocido: ' + ex;
        break;
    }
    return this.msjError;
  }
}
