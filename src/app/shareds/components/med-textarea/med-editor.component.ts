import { Component, forwardRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { isFunction } from 'lodash';
import * as Editor from 'src/libs/ckeditor5/ckeditor.js';
const advancedToolbar = {
  items: ['heading', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough',
    '|', 'bulletedList', 'numberedList', 'indent', 'outdent', 'horizontalLine',
    '|', 'mediaEmbed', 'imageUpload', 'imageStyle:full', 'imageStyle:side', 'blockQuote', 'codeBlock', 'insertTable',
    '|', 'mathType', 'specialCharacters',
    '|', 'undo', 'redo'],
  shouldNotGroupWhenFull: true,
}

const simpleToolbar = {
  items: [
    'heading', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough',
    '|', 'bulletedList', 'numberedList', 'indent', 'outdent',
    '|', 'undo', 'redo'
  ],
  shouldNotGroupWhenFull: true,
}
@Component({
  selector: 'med-editor',
  templateUrl: './med-editor.component.html',
  styleUrls: ['./med-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MedEditorComponent),
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class MedEditorComponent implements OnInit, ControlValueAccessor {
  @ViewChild('editor') editorComponent: CKEditorComponent
  @Input() placeholder: string
  @Input() advanced: boolean

  content: string

  Editor = Editor
  config: any

  private onChangeFn: Function

  constructor() { }

  ngOnInit(): void {
    this.config = {
      width: '100%',
      placeholder: this.placeholder
    }
  }

  onChange({ editor }: ChangeEvent) {
    if (!editor) {
      return
    }
    const content = editor.getData()
    if (isFunction(this.onChangeFn)) {
      this.onChangeFn(content)
    }
  }

  writeValue(content: string) {
    this.content = content || ''
    if (this.editorComponent) {
      this.editorComponent.editorInstance?.setData(this.content)
    }
  }

  registerOnChange(fn: Function) {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: Function) {
  }
}

