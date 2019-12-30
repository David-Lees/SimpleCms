import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicViewComponent } from './components/public-view/public-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';

const routes: Routes = [
  { path: '/admin', component: AdminViewComponent },
  { path: '/{id}', component: PublicViewComponent },
  { path: '*', component: PublicViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
