import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BannerSection } from 'src/app/models/banner-section';
import { ChildrenSection } from 'src/app/models/children-section';

let nexChildrenId = 0;

@Component({
  selector: 'app-edit-children',
  templateUrl: './edit-children.component.html',
  styleUrls: ['./edit-children.component.scss'],
})
export class EditChildrenComponent implements OnInit, OnChanges {
  @Input() section: ChildrenSection;
  @Output() sectionChange = new EventEmitter<ChildrenSection>();

  formGroup: FormGroup;
  lastChange: ChildrenSection;
  id = `radio-${nexChildrenId++}-`;

  updateImage(section: BannerSection) {
    this.section.image = section.image;
    this.sectionChange.emit(this.section);
  }

  ngOnChanges() {
    if (this.section && this.formGroup) {
      this.formGroup.setValue({
        backgroundColour: this.section?.backgroundColour,
        backgroundAlign: this.section?.backgroundAlign,
        colour: this.section?.colour,
      });
      this.lastChange = this.formGroup.value;
    }
  }

  ngOnInit() {
    this.formGroup = this.builder.group({
      backgroundColour: [this.section?.backgroundColour],
      backgroundAlign: [this.section?.backgroundAlign],
      colour: [this.section?.colour],
    });
    this.lastChange = this.formGroup.value;
    this.formGroup.valueChanges.subscribe((x: ChildrenSection) => {
      if (
        this.lastChange.backgroundAlign !== x.backgroundAlign ||
        this.lastChange.backgroundColour !== x.backgroundColour ||
        this.lastChange.colour !== x.colour ||
        this.lastChange.name !== x.name
      ) {
        this.lastChange = x;
        this.section.backgroundAlign = x.backgroundAlign;
        this.section.backgroundColour = x.backgroundColour;
        this.section.colour = x.colour;
        this.sectionChange.emit(this.section);
      }
    });
  }

  constructor(private builder: FormBuilder) {}
}
