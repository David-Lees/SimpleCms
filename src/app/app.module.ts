import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { AppRoutingModule } from './app-routing.module';
import { PublicViewComponent } from './components/public-view/public-view.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { HttpClientModule } from '@angular/common/http';
import { MediaComponent } from './components/media/media.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionComponent } from './components/section/section.component';
import { EditSectionComponent } from './components/edit-section/edit-section.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HeaderComponent } from './components/header/header.component';

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
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AzureStorageModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
