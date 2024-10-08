import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { JuegosModule } from './modules/juegos/juegos.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    JuegosModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'app-angular-gm';
  menu: string = 'home';
  isMenuOpen = false;
  usuarioLogueado: any = null;

  @ViewChild('menuRef', { static: true }) menuRef!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Escucha los cambios de usuario logueado
    this.authService.usuarioLogueado$.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario logueado:', usuario.email); // Mostrar el email del usuario
      }
      this.usuarioLogueado = usuario;
    });

    // Comprobar el tamaño de la ventana al inicializar el componente
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  // Cerrar sesión y redirigir al login
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  setMenu(menu: string) {
    this.menu = menu;
  }

  encuesta() {
    this.router.navigate(['/encuesta']);
  }

  ranking() {
    this.router.navigate(['/ranking']);
  }

  foro() {
    this.router.navigate(['/foro']);
  }
}
