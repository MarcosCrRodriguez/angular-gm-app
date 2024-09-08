import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app-angular-gm';

  usuarioLogueado: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  // se llama después de que Angular ha inicializado las propiedades de entrada del componente
  ngOnInit(): void {
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      console.log('Usuario logueado:', usuario);
      this.usuarioLogueado = usuario;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
