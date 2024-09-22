import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PuntajeComponent } from './components/puntaje/puntaje.component';
import { ForoComponent } from './components/foro/foro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'juegos',
    loadChildren: () =>
      import('./modules/juegos/juegos.module').then((m) => m.JuegosModule),
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'ranking',
    component: PuntajeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'foro',
    component: ForoComponent,
    canActivate: [authGuard],
  },
  { path: 'quien-soy', component: QuienSoyComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent },
];
