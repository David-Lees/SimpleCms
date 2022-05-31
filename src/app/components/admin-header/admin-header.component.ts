import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent implements OnInit {
  headerColour = '#FFF';
  headerBackground = '#000066';

  constructor() {}

  ngOnInit(): void {}
}
