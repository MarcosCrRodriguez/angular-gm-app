import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from './juegos.component';

const routes: Routes = [
  {
    path: '',
    component: JuegosComponent,
  },
  {
    path: 'ahorcado',
    loadChildren: () =>
      import('./ahorcado/ahorcado.module').then((m) => m.AhorcadoModule),
  },
  {
    path: 'mayor-menor',
    loadChildren: () =>
      import('./mayor-menor/mayor-menor.module').then(
        (m) => m.MayorMenorModule
      ),
  },
  {
    path: 'preguntados',
    loadChildren: () =>
      import('./preguntados/preguntados.module').then(
        (m) => m.PreguntadosModule
      ),
  },
  {
    path: 'generala',
    loadChildren: () =>
      import('./generala/generala.module').then((m) => m.GeneralaModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
