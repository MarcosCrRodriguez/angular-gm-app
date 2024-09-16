import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { JuegosComponent } from './juegos.component';

@NgModule({
  declarations: [JuegosComponent],
  imports: [CommonModule, JuegosRoutingModule],
})
export class JuegosModule {}
