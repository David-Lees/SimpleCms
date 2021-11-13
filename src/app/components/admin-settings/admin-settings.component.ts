import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/models/site';
import { SiteService } from 'src/app/services/site.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit {
  site: Site;
  loaded = false;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.load();
  }

  save() {
    this.siteService.save(this.site);
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      if (!this.site.id) this.site.id = uuidv4();
      if (!this.site.hasLogo) this.site.hasLogo = false;
      this.loaded = true;
    } else {
      setTimeout(() => this.load(), 20);
    }
  }
}
