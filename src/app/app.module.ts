import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { AppRoutingModule } from './modules/app-routing.module';
import { PublicViewComponent } from './components/public-view/public-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionComponent } from './components/section/section.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HeaderComponent } from './components/header/header.component';
import { MsAdalAngular6Module, AuthenticationGuard } from 'microsoft-adal-angular6';
import { environment } from 'src/environments/environment';
import { ToastsComponent } from './components/toasts/toasts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CredentialsInterceptor } from './interceptors/credentials.interceptor';
import { AngularMaterialModule } from './modules/angular-material.module';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TreeModule } from '@circlon/angular-tree-component';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    SectionComponent,
    HeaderComponent,
    ToastsComponent,
    SafeHtmlPipe,
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    TreeModule,
    FormsModule,
    ReactiveFormsModule,
    MsAdalAngular6Module.forRoot(getAdalConfig),
    HammerModule,
    FontAwesomeModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          sanitize: true,
        },
      },
    }),
  ],
  providers: [
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
