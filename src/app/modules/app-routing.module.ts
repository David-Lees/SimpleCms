import { NgModule } from '@angular/core';
import {
  Route,
  RouterModule,
  Routes,
  UrlMatchResult,
  UrlSegment,
  UrlSegmentGroup,
} from '@angular/router';
import { PublicViewComponent } from '../components/public-view/public-view.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { AdminComponent } from '../components/admin/admin.component';
import { AdminContentComponent } from '../components/admin-content/admin-content.component';
import { AdminLibraryComponent } from '../components/admin-library/admin-library.component';
import { AdminSettingsComponent } from '../components/admin-settings/admin-settings.component';

function filepathMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult {
  // match urls like "/filepath" where filepath can contain '/'
  if (segments.length > 0) {
    // if first segment is 'files', then concat all the next segments into a single one
    // and return it as a parameter named 'filepath'
    return {
      consumed: segments,
      posParams: {
        url: new UrlSegment(segments.join('/'), {}),
      },
    };
  }
  return null;
}

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthenticationGuard],
    children: [
      { path: '', component: AdminContentComponent },
      { path: 'library', component: AdminLibraryComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
  },
  { matcher: filepathMatcher, component: PublicViewComponent },
  { path: '', component: PublicViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
