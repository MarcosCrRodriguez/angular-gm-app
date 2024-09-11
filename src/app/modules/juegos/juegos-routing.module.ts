import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../../components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../components/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../../components/juegos/preguntados/preguntados.component';
import { GeneralaComponent } from '../../components/juegos/generala/generala.component';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'generala', component: GeneralaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}
