import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../../components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../components/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../../components/juegos/preguntados/preguntados.component';
import { GeneralaComponent } from '../../components/juegos/generala/generala.component';

@NgModule({
  declarations: [
    AhorcadoComponent,
    MayorMenorComponent,
    PreguntadosComponent,
    GeneralaComponent,
  ],
  imports: [CommonModule, JuegosRoutingModule],
})
export class JuegosModule {}
