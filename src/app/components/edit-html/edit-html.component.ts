import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlSection } from 'src/app/models/html-section';
import { TextSection } from 'src/app/models/text-section';

let nextHtmlId = 0;

@Component({
  selector: 'app-edit-html',
  templateUrl: './edit-html.component.html',
  styleUrls: ['./edit-html.component.scss'],
})
export class EditHtmlComponent implements OnInit, OnChanges {
  @Input() section: HtmlSection;
  @Output() sectionChange = new EventEmitter<HtmlSection>();

  html: string;
  lastChange: HtmlSection = { name: '', html: '' };
  id = `radio-${nextHtmlId++}-`;

  ngOnChanges() {
    if (this.html !== this.section.html) {
      console.log('setting text section');
      this.lastChange.name = this.section.name;
      this.lastChange.html = this.section.html;
    }
  }

  ngOnInit() {
    this.html = this.section.html;
    this.lastChange.name = this.section.name;
    this.lastChange.html = this.html;
  }

  change() {
    console.log('form change', this.html);
    this.lastChange.html = this.html;
    this.sectionChange.emit(this.lastChange);
  }
}
