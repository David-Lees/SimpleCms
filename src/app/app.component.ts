import { Component } from '@angular/core';
import { SiteService } from './services/site.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'SimpleCms';
  loaded = false;

  constructor(private site: SiteService) {}
}
