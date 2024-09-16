import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'juegos',
    loadChildren: () =>
      import('./modules/juegos/juegos.module').then((m) => m.JuegosModule),
  },
  // {
  //   path: 'juegos',
  //   loadComponent: () =>
  //     import('./components/juegos/juego/juego.component').then(
  //       (c) => c.JuegoComponent
  //     ),
  //   children: [
  //     {
  //       path: 'ahorcado',
  //       // title: 'Juego - Ahorcado',
  //       loadComponent: () =>
  //         import('./components/juegos/ahorcado/ahorcado.component').then(
  //           (c) => c.AhorcadoComponent
  //         ),
  //     },
  //     {
  //       path: 'mayor-menor',
  //       // title: 'Juego - Mayor Menor',
  //       loadComponent: () =>
  //         import('./components/juegos/mayor-menor/mayor-menor.component').then(
  //           (c) => c.MayorMenorComponent
  //         ),
  //     },
  //     {
  //       path: 'preguntados',
  //       // title: 'Juego - Preguntados',
  //       loadComponent: () =>
  //         import('./components/juegos/preguntados/preguntados.component').then(
  //           (c) => c.PreguntadosComponent
  //         ),
  //     },
  //     {
  //       path: 'generala',
  //       // title: 'Juego - Generala',
  //       loadComponent: () =>
  //         import('./components/juegos/generala/generala.component').then(
  //           (c) => c.GeneralaComponent
  //         ),
  //     },
  //   ],
  // },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: PageNotFoundComponent },
];
