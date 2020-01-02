import { Component, OnInit, Input } from '@angular/core';
import { Site } from 'src/app/models/site';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isMenuCollapsed = true;

  @Input() site: Site;

  constructor() {}

  ngOnInit() {}
}
