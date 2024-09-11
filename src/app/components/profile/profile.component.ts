import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  usuarioLogueado: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // nos suscribimos al observable para obtener el usuario logueado
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      console.log('Usuario logueado en ProfileComponent:', usuario?.email);
      this.usuarioLogueado = usuario;
    });
  }
}
