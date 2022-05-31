import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminContentComponent } from 'src/app/components/admin-content/admin-content.component';
import { AdminLibraryComponent } from 'src/app/components/admin-library/admin-library.component';
import { AdminSettingsComponent } from 'src/app/components/admin-settings/admin-settings.component';
import { AdminComponent } from 'src/app/components/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: AdminContentComponent },
      { path: 'library', component: AdminLibraryComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
