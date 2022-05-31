import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from 'src/app/components/admin-header/admin-header.component';
import { AdminAddFolderComponent } from 'src/app/components/admin-add-folder/admin-add-folder.component';
import { AdminContentComponent } from 'src/app/components/admin-content/admin-content.component';
import { AdminLibraryComponent } from 'src/app/components/admin-library/admin-library.component';
import { AdminRenameFolderComponent } from 'src/app/components/admin-rename-folder/admin-rename-folder.component';
import { AdminSettingsComponent } from 'src/app/components/admin-settings/admin-settings.component';
import { AdminSortSectionsComponent } from 'src/app/components/admin-sort-sections/admin-sort-sections.component';
import { AdminTreeComponent } from 'src/app/components/admin-tree/admin-tree.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeMirrorModule } from '@robotcoral/ngx-codemirror6';
import { EditBannerComponent } from 'src/app/components/edit-banner/edit-banner.component';
import { EditChildrenComponent } from 'src/app/components/edit-children/edit-children.component';
import { EditGalleryComponent } from 'src/app/components/edit-gallery/edit-gallery.component';
import { EditPageComponent } from 'src/app/components/edit-page/edit-page.component';
import { EditSectionComponent } from 'src/app/components/edit-section/edit-section.component';
import { EditTextComponent } from 'src/app/components/edit-text/edit-text.component';
import { FolderSelectComponent } from 'src/app/components/folder-select/folder-select.component';
import { MediaListComponent } from 'src/app/components/media-list/media-list.component';
import { MediaTreeComponent } from 'src/app/components/media-tree/media-tree.component';
import { SelectImageComponent } from 'src/app/components/select-image/select-image.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularMaterialModule } from '../angular-material.module';
import { EditHtmlComponent } from 'src/app/components/edit-html/edit-html.component';
import { MaterialFileUploadComponent } from 'src/app/components/material-file-upload/material-file-upload.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { AdminComponent } from 'src/app/components/admin/admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminLibraryComponent,
    AdminTreeComponent,
    AdminContentComponent,
    AdminSettingsComponent,
    AdminAddFolderComponent,
    AdminRenameFolderComponent,
    AdminSortSectionsComponent,
    EditSectionComponent,
    EditTextComponent,
    EditGalleryComponent,
    EditPageComponent,
    EditBannerComponent,
    MediaTreeComponent,
    SelectImageComponent,
    MediaListComponent,
    FolderSelectComponent,
    EditChildrenComponent,
    MaterialFileUploadComponent,
    EditHtmlComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MatDialogModule,
    MatToolbarModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CodeMirrorModule,
    FontAwesomeModule,
    MatProgressBarModule,
    LMarkdownEditorModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
