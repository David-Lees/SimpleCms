import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { AppRoutingModule } from './modules/app-routing.module';
import { PublicViewComponent } from './components/public-view/public-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MediaComponent } from './components/media/media.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionComponent } from './components/section/section.component';
import { EditSectionComponent } from './components/edit-section/edit-section.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HeaderComponent } from './components/header/header.component';
import { EditTextComponent } from './components/edit-text/edit-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditGalleryComponent } from './components/edit-gallery/edit-gallery.component';
import { EditPageComponent } from './components/edit-page/edit-page.component';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { environment } from 'src/environments/environment';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { ToastsComponent } from './components/toasts/toasts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditBannerComponent } from './components/edit-banner/edit-banner.component';
import { CredentialsInterceptor } from './interceptors/credentials.interceptor';
import { AngularMaterialModule } from './modules/angular-material.module';
import { MaterialFileUploadComponent } from './components/material-file-upload/material-file-upload.component';

export function getAdalConfig() {
  return {
    ...environment.config,
    redirectUri: window.location.origin,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    ViewerComponent,
    PublicViewComponent,
    AdminViewComponent,
    MediaComponent,
    SectionComponent,
    EditSectionComponent,
    HeaderComponent,
    EditTextComponent,
    EditGalleryComponent,
    EditPageComponent,
    ToastsComponent,
    EditBannerComponent,
    MaterialFileUploadComponent,
  ],
  imports: [
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LMarkdownEditorModule,
    AppRoutingModule,
    NgbModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          sanitize: true,
        },
      },
    }),
    MsAdalAngular6Module.forRoot(getAdalConfig),
  ],
  providers: [AuthenticationGuard, { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
