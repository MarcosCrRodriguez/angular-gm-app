import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralaComponent } from './generala.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralaRoutingModule {}
