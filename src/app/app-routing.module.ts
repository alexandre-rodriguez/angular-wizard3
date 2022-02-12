import { _resolveDirectionality } from '@angular/cdk/bidi/directionality';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExemploComponent } from './exemplo/exemplo.component';

const routes: Routes = [
  {
    path: 'exemplo',
    component: ExemploComponent,
  },
  { path: '', redirectTo: 'exemplo', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
