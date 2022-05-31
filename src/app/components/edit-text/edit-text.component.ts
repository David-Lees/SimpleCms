import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TextSection } from 'src/app/models/text-section';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BannerSection } from 'src/app/models/banner-section';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
})
export class EditTextComponent implements OnChanges, OnInit {
  @Input() section: TextSection;
  @Output() sectionChange = new EventEmitter<TextSection>();

  formGroup: FormGroup;
  id = uuidv4();

  updateImage(section: BannerSection) {
    this.section.image = JSON.parse(JSON.stringify(section.image));
    this.sectionChange.emit(this.section);
  }

  ngOnChanges() {
    if (this.section && this.formGroup) {
      this.formGroup.setValue({
        text: this.section.text,
        backgroundColour: this.section?.backgroundColour,
        backgroundAlign: this.section?.backgroundAlign,
        colour: this.section?.colour,
        align: this.section?.align,
      });
    }
  }

  ngOnInit() {
    this.formGroup = this.builder.group({
      text: [this.section?.text],
      backgroundColour: [this.section?.backgroundColour],
      backgroundAlign: [this.section?.backgroundAlign],
      colour: [this.section?.colour],
      align: [this.section?.align],
    });
    this.formGroup.valueChanges.subscribe((x: TextSection) => {
      this.section.align = x.align;
      this.section.backgroundAlign = x.backgroundAlign;
      this.section.backgroundColour = x.backgroundColour;
      this.section.colour = x.colour;
      this.section.text = x.text;
      this.sectionChange.emit(this.section);
    });
  }

  constructor(private builder: FormBuilder) {}
}
