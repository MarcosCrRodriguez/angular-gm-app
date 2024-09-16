import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreguntadosRoutingModule } from './preguntados-routing.module';
import { PreguntadosComponent } from './preguntados.component';

@NgModule({
  declarations: [PreguntadosComponent],
  imports: [CommonModule, PreguntadosRoutingModule],
})
export class PreguntadosModule {}
