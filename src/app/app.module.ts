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
import { EditSectionComponent } from './components/edit-section/edit-section.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HeaderComponent } from './components/header/header.component';
import { EditTextComponent } from './components/edit-text/edit-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditGalleryComponent } from './components/edit-gallery/edit-gallery.component';
import { EditPageComponent } from './components/edit-page/edit-page.component';
import { MsAdalAngular6Module, AuthenticationGuard } from 'microsoft-adal-angular6';
import { environment } from 'src/environments/environment';
import { ToastsComponent } from './components/toasts/toasts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditBannerComponent } from './components/edit-banner/edit-banner.component';
import { CredentialsInterceptor } from './interceptors/credentials.interceptor';
import { AngularMaterialModule } from './modules/angular-material.module';
import { MaterialFileUploadComponent } from './components/material-file-upload/material-file-upload.component';
import { EditHtmlComponent } from './components/edit-html/edit-html.component';
import { CodeMirrorModule } from '@robotcoral/ngx-codemirror6';
import { SafeHtmlPipe } from './safe-html.pipe';
import { TreeModule } from '@circlon/angular-tree-component';
import { SelectImageComponent } from './components/select-image/select-image.component';
import { MediaListComponent } from './components/media-list/media-list.component';
import { FolderSelectComponent } from './components/folder-select/folder-select.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MediaTreeComponent } from './components/media-tree/media-tree.component';
import { EditChildrenComponent } from './components/edit-children/edit-children.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLibraryComponent } from './components/admin-library/admin-library.component';
import { AdminTreeComponent } from './components/admin-tree/admin-tree.component';
import { AdminContentComponent } from './components/admin-content/admin-content.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminAddFolderComponent } from './components/admin-add-folder/admin-add-folder.component';
import { AdminRenameFolderComponent } from './components/admin-rename-folder/admin-rename-folder.component';
import { AdminSortSectionsComponent } from './components/admin-sort-sections/admin-sort-sections.component';

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
    EditSectionComponent,
    HeaderComponent,
    EditTextComponent,
    EditGalleryComponent,
    EditPageComponent,
    ToastsComponent,
    EditBannerComponent,
    MaterialFileUploadComponent,
    EditHtmlComponent,
    SafeHtmlPipe,
    SelectImageComponent,
    MediaListComponent,
    FolderSelectComponent,
    MediaTreeComponent,
    EditChildrenComponent,
    AdminHeaderComponent,
    AdminComponent,
    AdminLibraryComponent,
    AdminTreeComponent,
    AdminContentComponent,
    AdminSettingsComponent,
    AdminAddFolderComponent,
    AdminRenameFolderComponent,
    AdminSortSectionsComponent,
  ],
  imports: [
    AngularMaterialModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LMarkdownEditorModule,
    AppRoutingModule,
    NgbModule,
    CodeMirrorModule,
    TreeModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          sanitize: true,
        },
      },
    }),
    MsAdalAngular6Module.forRoot(getAdalConfig),
    HammerModule,
    FontAwesomeModule,
  ],
  providers: [
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
