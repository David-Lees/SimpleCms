import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TextSection } from 'src/app/models/text-section';
import { FormBuilder, FormGroup } from '@angular/forms';

let nextTextId = 0;

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
})
export class EditTextComponent {
  @Input() section: TextSection;
  @Output() sectionChange = new EventEmitter<TextSection>();
  formGroup: FormGroup;
  id = `radio-${nextTextId++}-`;
  constructor(private builder: FormBuilder) {
    this.formGroup = this.builder.group({
      text: [],
      backgroundColour: [],
      colour: [],
      align: [],
    });
    this.formGroup.valueChanges.subscribe((x: TextSection) => {
      this.sectionChange.emit(x);
    });
  }
}
