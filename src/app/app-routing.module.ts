import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HouseListComponent } from './house-list/house-list.component';

const routes: Routes = [

  { path: 'house-list', component: HouseListComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
