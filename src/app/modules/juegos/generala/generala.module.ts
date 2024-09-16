import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralaRoutingModule } from './generala-routing.module';
import { GeneralaComponent } from './generala.component';

@NgModule({
  declarations: [GeneralaComponent],
  imports: [CommonModule, GeneralaRoutingModule],
})
export class GeneralaModule {}
