import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HtmlSection } from 'src/app/models/html-section';
import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { lineNumbers, gutter } from '@codemirror/gutter';

let nextHtmlId = 0;

@Component({
  selector: 'app-edit-html',
  templateUrl: './edit-html.component.html',
  styleUrls: ['./edit-html.component.scss'],
})
export class EditHtmlComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() section: HtmlSection;
  @Output() sectionChange = new EventEmitter<HtmlSection>();
  @ViewChild('codemirrorhost') codemirrorhost: ElementRef = null;

  html: string;
  lastChange: HtmlSection = { name: '', html: '' };
  id = `html-${nextHtmlId++}-`;

  config: any;
  editor: EditorView;

  ngOnChanges() {
    if (this.html !== this.section.html) {
      this.lastChange.name = this.section.name;
      this.lastChange.html = this.section.html;
    }
  }

  ngAfterViewInit(): void {
    const self = this;
    this.config = {
      doc: this.html,
      extensions: [
        basicSetup,
        EditorView.updateListener.of(update => {
          self.html = update.state.doc.toString();
          self.change();
        }),
        keymap.of([indentWithTab]),
        html(),
        lineNumbers(),
        gutter({}),
      ],
    };
    const state = EditorState.create(this.config);
    this.init(state);
  }

  init(state: EditorState) {
    this.editor = new EditorView({
      state,
      parent: this.codemirrorhost.nativeElement,
    });
  }

  ngOnInit() {
    this.html = this.section.html;
    this.lastChange.name = this.section.name;
    this.lastChange.html = this.html;
  }

  change() {
    if (this.lastChange.html !== this.html) {
      this.lastChange.html = this.html;
      this.sectionChange.emit(this.lastChange);
    }
  }
}
