import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { isMoment } from 'moment';
import { DateFormatHelper } from '../../helpers/date-format.helper';
import { isDate, isDefined } from '../../utils/common.util';
import * as moment from 'moment';
@Component({
  selector: 'med-select-datetime',
  templateUrl: './med-select-datetime.component.html',
  styleUrls: ['./med-select-datetime.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MedSelectDatetimeComponent), multi: true},
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MedSelectDatetimeComponent),
      multi: true,
    },
    {provide: NgbDateParserFormatter, useClass: DateFormatHelper}
  ],
  encapsulation: ViewEncapsulation.None
})
export class MedSelectDatetimeComponent implements OnInit, ControlValueAccessor, Validator {
  datePicker: any = null;
  @Input() disabled = false;
  isValid = true;
  @Output() onclick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() error = false;

  constructor() {
  }

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    if (isDefined(obj)) {
      this.datePicker = moment(obj);
    } else {
      this.datePicker = null;
    }
  }

  onChangeDate($event) {
    if (isDate(this.datePicker) || isMoment(this.datePicker)) {
      this.isValid = true;
      this.onChange(this.datePicker.format());
      this.onSelected.emit(this.datePicker.format());
    } else {
      if (this.datePicker) {
        this.isValid = false;
        this.onChange('');
        this.onSelected.emit('');
      }
    }

  }

  touched() {
    this.onclick.emit();
  }

  focusOut(event) {
    if (isDate(this.datePicker) || isMoment(this.datePicker)) {
      this.isValid = true;
      this.onChange(this.datePicker.format());
      this.onSelected.emit(this.datePicker.format());
    } else {
      if (event.target.value && event.target.value.length > 0) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
      this.onChange('');
      this.onSelected.emit('');
    }
  }

  validate(_: FormControl) {
    return this.isValid ? null : {ErrorFormat: true};
  }
}
