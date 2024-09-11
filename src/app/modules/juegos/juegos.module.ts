import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AhorcadoComponent } from '../../components/juegos/ahorcado/ahorcado.component';

@NgModule({
  declarations: [AhorcadoComponent],
  exports: [AhorcadoComponent],
  imports: [CommonModule],
})
export class JuegosModule {}
