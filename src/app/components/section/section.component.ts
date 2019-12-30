import { Component, OnInit, Input } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.sass'],
})
export class SectionComponent implements OnInit {
  sectionTypes = SectionTypes;

  @Input() section: Section;

  constructor() {}

  ngOnInit() {}
}
