import { isDefined } from './../../utils/common.util';
import { Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(() => MedSwitchToggleComponent),
  multi: true
};
@Component({
  selector: 'med-switch-toggle',
  templateUrl: './med-switch-toggle.component.html',
  styleUrls: ['./med-switch-toggle.component.scss'],
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class MedSwitchToggleComponent implements ControlValueAccessor {

  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;

  @Input() size = 'small';
  @Output() change = new EventEmitter<boolean>();
  @Input() labelOn = '';
  @Input() labelOff = '';
  @Input() label = '';
  @Input() set checked(v: boolean) {
    this._checked = v !== false;
  }
  get checked() {
    return this._checked;
  }

  @Input() set disabled(v: boolean) {
    this._disabled = v !== false;
  }

  get disabled() {
    return this._disabled;
  }

  @Input() set reverse(v: boolean) {
    this._reverse = v !== false;
  }

  get reverse() {
    return this._reverse;
  }

  @HostListener('click')
  onToggle() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.change.emit(this.checked);
    this.changed(this.checked);
    this.touched(this.checked);
  }

  // Implement control value accessor

  changed = (_: any) => {};

  touched = (_: any) => {};

  public writeValue(obj: any) {
    if (isDefined(obj)) {
      this.checked = !!obj;
    } else {
      this.checked = false;
    }
  }

  public registerOnChange(fn: any) {
    this.changed = fn;
  }

  public registerOnTouched(fn: any) {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    //
  }
}