import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  updatePassword as firebaseUpdatePassword,
  authState,
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
      // console.log('Estado de autenticación cambiado:', user);
      this.usuarioLogueado.next(user);
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.getUserRegistrado(res.user.email!).subscribe((userData) => {
          const usuarioCompleto = {
            ...res.user,
            rol: userData.rol,
          };
          localStorage.setItem('user', JSON.stringify(usuarioCompleto));
          this.logUserActivity(res.user.email!);
        });
        // this.logUserActivity(res.user.email!);
        // localStorage.setItem('user', JSON.stringify(res.user));
        // // this.router.navigate(['/home']);
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
    localStorage.removeItem('user');
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
            rol: userData.rol,
          };
        } else {
          return {
            usuario: usuario,
            nombre: 'No hay datos',
            apellido: 'No hay datos',
            edad: 'No hay datos',
            rol: 'No hay datos',
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
          const maxPuntos = Math.max(
            ...respuesta.map((rankingData) => rankingData.puntos)
          );
          return {
            puntos: maxPuntos,
          };
        } else {
          return {
            puntos: 'Sin score',
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

  getEncuestaRegistrada(usuario: string): Observable<any> {
    let col = collection(this.firestore, 'encuestas');

    const filteredQuery = query(
      col,
      where('email', '==', usuario),
      orderBy('fecha', 'desc'),
      limit(1)
    );

    return collectionData(filteredQuery).pipe(
      map((respuesta: any[]) => {
        if (respuesta.length > 0) {
          const userData = respuesta[0];
          return {
            email: userData.usuario,
            fecha: this.formatTimestampToDate(userData.fecha),
            nombre: userData.nombre || 'No hay datos',
            apellido: userData.apellido || 'No hay datos',
            edad: userData.edad || 'No hay datos',
            telefono: userData.telefono || 'No hay datos',
            disfrutaPagina: userData.disfrutaPagina || 'No hay datos',
            juegosJugados:
              userData.juegosJugados?.length > 0
                ? userData.juegosJugados
                : ['No hay datos'],
            juegoMasGustado: userData.juegoMasGustado || 'No hay datos',
            juegoMenosGustado: userData.juegoMenosGustado || 'No hay datos',
            comentario: userData.comentario || 'No hay datos',
          };
        } else {
          return {
            email: usuario,
            fecha: 'No hay datos',
            nombre: 'No hay datos',
            apellido: 'No hay datos',
            edad: 'No hay datos',
            telefono: 'No hay datos',
            disfrutaPagina: 'No hay datos',
            juegosJugados: ['No hay datos'],
            juegoMasGustado: 'No hay datos',
            juegoMenosGustado: 'No hay datos',
            comentario: 'No hay datos',
          };
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
      rol: 'usuario',
    })
      .then(() => {
        console.log('Datos opcionales registrados exitosamente');
      })
      .catch((error) => {
        console.error('Error al registrar datos opcionales:', error);
      });
  }

  registroEncuesta(datos: {
    email: string;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    disfrutaPagina: boolean;
    juegosJugados: string[];
    juegoMasGustado: string;
    juegoMenosGustado: string;
    comentario?: string;
  }) {
    const col = collection(this.firestore, 'encuestas');
    addDoc(col, { ...datos, fecha: new Date() })
      .then(() => {
        console.log('Registramos la encuesta en la DB');
      })
      .catch((error) => {
        console.error('Error al registrar la encuesta: ', error);
      });
  }

  private getErrorMessage(ex: string): string {
    switch (ex) {
      case 'auth/invalid-credential':
        this.msjError = '¡Credenciales inválidas!';
        break;
      case 'auth/missing-email':
        this.msjError = '¡Faltan datos para que sea un mail válido!';
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

  mostrarMsjAdvertencia() {
    Swal.fire({
      title: 'Acceso restringido',
      text: 'Necesitas iniciar sesión para acceder a esta sección.',
      icon: 'warning',
      confirmButtonText: 'Ir al login',
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  mostrarMsjError(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonText: 'Okey',
    }).then(() => {
      this.router.navigate(['/error'], {
        state: { error: texto },
      });
    });
  }

  public formatTimestampToDate(timestamp: any): string {
    // Verifica si el timestamp es válido
    if (timestamp && timestamp.seconds) {
      // Convierte el timestamp en un objeto Date
      const date = new Date(timestamp.seconds * 1000);

      // Formatea la fecha en el formato deseado (por ejemplo, 'DD/MM/YYYY')
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
    return 'Fecha no válida';
  }
}
