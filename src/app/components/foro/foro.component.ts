import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css',
})
export class ForoComponent implements OnInit {
  public nuevoMensaje: string = '';
  public mensajes$!: Observable<any[]>;
  public mensajes: any[] = [];
  public isLoadingMensajes: boolean = true;
  public usuarioAdmin: string = 'piedecamello@gmail.com';
  public usuarioEspecial: string = 'berrueberru@gmail.com';
  public usuarioSlayer: string = 'doomslayer@hothell.com';

  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMensajes();
  }

  loadMensajes() {
    const mensajesRef = collection(this.firestore, 'mensajes');
    const q = query(mensajesRef, orderBy('timestamp', 'desc'), limit(15));
    this.mensajes$ = collectionData(q, { idField: 'id' });

    this.mensajes$.subscribe((data) => {
      this.mensajes = data;
      this.isLoadingMensajes = false;
    });
  }

  async enviarMensaje(): Promise<void> {
    const usuario = this.authService.getUsuarioLogueado();
    const mensaje = this.nuevoMensaje.trim();

    if (mensaje.length > 200) {
      // Muestra mensaje de error con Toastify
      Swal.fire({
        title: 'Error',
        text: 'Demasiados caracteres. ¡Máximo 200!',
        icon: 'error',
        background: '#fff',
        backdrop: 'rgba(0,0,123,0.3)',
        timer: 4000,
        timerProgressBar: true,
      });
      return;
    }

    if (usuario && mensaje) {
      const mensajesRef = collection(this.firestore, 'mensajes');
      await addDoc(mensajesRef, {
        usuario: usuario.email,
        texto: mensaje,
        timestamp: new Date(),
      });
      this.nuevoMensaje = '';
      this.loadMensajes();
    }
  }
}
