import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados.component';
import { GeneralaComponent } from './components/juegos/generala/generala.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'juegos',
    children: [
      { path: 'ahorcado', component: AhorcadoComponent },
      { path: 'mayor-menor', component: MayorMenorComponent },
      { path: 'preguntados', component: PreguntadosComponent },
      { path: 'generala', component: GeneralaComponent },
    ],
  },
  // {
  //   path: 'juego',
  //   loadComponent: () =>
  //     import('./components/juegos/juego/juego.component').then(
  //       (c) => c.JuegoComponent
  //     ),
  //   children: [
  //     {
  //       path: 'mayor-menor',
  //       title: 'Juego - Mayor Menor',
  //       loadComponent: () =>
  //         import('./components/juegos/mayor-menor/mayor-menor.component').then(
  //           (c) => c.MayorMenorComponent
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
