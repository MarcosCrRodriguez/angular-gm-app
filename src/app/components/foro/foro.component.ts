import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css',
})
export class ForoComponent implements OnInit {
  nuevoMensaje: string = '';
  mensajes$!: Observable<any[]>;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit(): void {
    const mensajesRef = collection(this.firestore, 'mensajes');
    const q = query(mensajesRef, orderBy('timestamp', 'desc'));
    this.mensajes$ = collectionData(q, { idField: 'id' });
  }

  async enviarMensaje(): Promise<void> {
    const usuario = this.authService.getUsuarioLogueado();
    const mensaje = this.nuevoMensaje.trim();

    if (usuario && mensaje) {
      const mensajesRef = collection(this.firestore, 'mensajes');
      await addDoc(mensajesRef, {
        usuario: usuario.email,
        texto: mensaje,
        timestamp: new Date(),
      });
      this.nuevoMensaje = '';
    }
  }
}
