import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'med-button',
  template: `
  <button [attr.type]="type" [ngClass]="classes" [disabled]="isDisableOnLoading && loading"
          (click)="clicked.emit()">
      <i [ngClass]="icon" *ngIf="!loading && icon"></i>
      <i [ngClass]="loadingIcon" *ngIf="loading"></i>
      <ng-content></ng-content>
  </button>
`
})

export class MedButtonComponent implements OnInit {
  @Output() clicked = new EventEmitter();
  @Input() icon = '';
  @Input() loadingIcon = 'fa fa-spinner fa-spin';
  @Input() classes = 'btn btn-primary';
  @Input() type = 'submit';
  @Input() loading: boolean;
  @Input() isDisableOnLoading = true;
  constructor() { }

  ngOnInit(): void {
  }

}
