import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TextSection } from 'src/app/models/text-section';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BannerSection } from 'src/app/models/banner-section';

let nextTextId = 0;

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
})
export class EditTextComponent implements OnChanges, OnInit {
  @Input() section: TextSection;
  @Output() sectionChange = new EventEmitter<TextSection>();

  formGroup: FormGroup;
  lastChange: TextSection;
  id = `radio-${nextTextId++}-`;

  updateImage(section: BannerSection) {
    this.section.image = section.image;
    this.sectionChange.emit(this.section);
  }

  ngOnChanges() {
    if (
      this.formGroup &&
      this.lastChange.text !== this.section.text &&
      this.lastChange.align !== this.section.align &&
      this.lastChange.backgroundColour !== this.section.backgroundColour &&
      this.lastChange.colour !== this.section.colour
    ) {
      console.log('setting text section');
      this.formGroup.setValue(this.section);
      this.lastChange = this.formGroup.value;
    }
  }

  ngOnInit() {
    this.formGroup = this.builder.group({
      text: [this.section.text],
      backgroundColour: [this.section.backgroundColour],
      backgroundAlign: [this.section.backgroundAlign],
      colour: [this.section.colour],
      align: [this.section.align],
    });
    this.lastChange = this.formGroup.value;
    this.formGroup.valueChanges.subscribe((x: TextSection) => {
      if (
        this.lastChange.align !== x.align ||
        this.lastChange.backgroundAlign !== x.backgroundAlign ||
        this.lastChange.backgroundColour !== x.backgroundColour ||
        this.lastChange.colour !== x.colour ||
        this.lastChange.name !== x.name ||
        this.lastChange.text !== x.text
      ) {
        console.log('form change', x);
        this.lastChange = x;
        this.section.align = x.align;
        this.section.backgroundAlign = x.backgroundAlign;
        this.section.backgroundColour = x.backgroundColour;
        this.section.colour = x.colour;
        this.section.text = x.text;
        this.sectionChange.emit(this.section);
      }
    });
  }

  constructor(private builder: FormBuilder) {}
}
