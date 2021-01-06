import { Component, forwardRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { DateFormatHelper } from '../../helpers/date-format.helper';
import { isDefined } from '../../utils/common.util';
const noop = () => {
};
@Component({
  selector: 'med-select-date',
  templateUrl: './med-select-date.component.html',
  styleUrls: ['./med-select-date.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MedSelectDateComponent), multi: true},
    { provide: NgbDateParserFormatter, useClass: DateFormatHelper}
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MedSelectDateComponent implements OnInit, ControlValueAccessor {
  datePicker: any = null;

  constructor() {
  }

  onChange: any = () => { };
  onTouched: any = () => { };

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
    }
  }

  onChangeDate() {
   this.onChange(this.datePicker.format());
  }

}