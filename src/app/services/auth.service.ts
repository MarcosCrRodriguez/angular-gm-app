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

// indica que el servicio -> singleton y se proporciona en el nivel raíz de la aplicación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioLogueadoSubject = new BehaviorSubject<any>(null);
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
      this.usuarioLogueado.next(user); // Actualiza el usuario logueado
    });
  }

  // Función para loguear usuarios
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
        this.login(email, password);
        // this.router.navigate(['/login']); // Redireccionar al login
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

  // Obtener los datos del usuario desde Firestore
  getUsuarioRegistrado(usuario: string): Observable<any[]> {
    const col = collection(this.firestore, 'registro');

    const filteredQuery = query(col, where('user', '==', usuario));

    // this.getUser(usuario);

    // Retornamos el observable de los datos
    return collectionData(filteredQuery);
  }

  getUserRegistrado(usuario: string): Observable<any> {
    let col = collection(this.firestore, 'registro');

    const filteredQuery = query(col, where('usuario', '==', usuario));

    // Retornamos el observable en lugar de usar un Subject
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

  getRankingJuegos(tipoJuego: string): Observable<any> {
    let col = collection(this.firestore, tipoJuego);

    // Filtrar y ordenar por puntos, límite de 3
    const filteredQuery = query(col, orderBy('puntos', 'desc'), limit(3));

    return collectionData(filteredQuery).pipe(
      map((respuesta: any[]) => {
        if (respuesta.length > 0) {
          return respuesta.map((userData) => ({
            usuario: userData.usuario, // Aquí aseguramos que "usuario" esté presente
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

  // Guardar logs de usuarios en Firebase
  private logUserActivity(email: string) {
    const col = collection(this.firestore, 'logins');
    addDoc(col, { fecha: new Date(), user: email });
  }

  // Guardar puntos en Firebase
  scoreJuegos(email: string, puntos: number, tipoJuego: string) {
    const col = collection(this.firestore, tipoJuego);
    addDoc(col, { fecha: new Date(), usuario: email, puntos: puntos });
    console.log('Entramos a mayor-menor firebufga');
  }

  // Datos opcionales registro de datos en Firebase
  optionalRegisterData(
    usuario: string,
    nombre: string,
    apellido: string,
    edad: string
  ) {
    const col = collection(this.firestore, 'registro');

    // Agregar validación extra si fuera necesario
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

  // Manejar mensajes de error de Firebase
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
