import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, NgZone, OnInit, Output, ViewRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMultiSelectSettings, ListItem } from './med-multiple-select.model';

export const MED_DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MedMultipleSelectComponent),
  multi: true
};

const noop = () => {
};

@Component({
  selector: 'med-multiple-select',
  templateUrl: './med-multiple-select.component.html',
  styleUrls: ['./med-multiple-select.component.scss'],
  providers: [MED_DROPDOWN_CONTROL_VALUE_ACCESSOR]
})
export class MedMultipleSelectComponent implements ControlValueAccessor {
  public _settings: IMultiSelectSettings;
  public _data: Array<ListItem> = [];
  public selectedItems: Array<ListItem> = [];
  public isDropdownOpen = true;
  _placeholder = 'Chọn giá trị';
  filter: ListItem = new ListItem(this.data);
  defaultSettings: IMultiSelectSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: false,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 999999999999,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    isChildField: false,
    idParentField: 'parentId'
  };
  @Input()
  error = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() config: any;

  @Input()
  public set placeholder(value: string) {
    if (value) {
      this._placeholder = value;
    } else {
      this._placeholder = 'Select';
    }
  }

  @Input()
  disabled = false;

  @Input()
  public set settings(value: IMultiSelectSettings) {
    if (value) {
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  @Input()
  public set data(value: Array<any>) {
    if (!value) {
      this._data = [];
    } else {
      // const _items = value.filter((item: any) => {
      //   if (typeof item === 'string' || (typeof item === 'object' && item && item[this._settings.idField] && item[this._settings.textField])) {
      //     return item;
      //   }
      // });
      this._data = value.map(
        (item: any) =>
          typeof item === 'string'
            ? new ListItem(item)
            : new ListItem({
              id: this._settings.isChildField ? item[this._settings.idParentField][this._settings.idField] : item[this._settings.idField],
              text: this._settings.isChildField ? item[this._settings.idParentField][this._settings.textField] : item[this._settings.textField]
            })
      );
    }
  }

  @Output('onFilterChange')
  onFilterChange: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output('onDropDownClose')
  onDropDownClose: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output('onSelect')
  onSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output('onDeSelect')
  onDeSelect: EventEmitter<ListItem> = new EventEmitter<any>();

  @Output('onSelectAll')
  onSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();

  @Output('onDeSelectAll')
  onDeSelectAll: EventEmitter<Array<ListItem>> = new EventEmitter<Array<any>>();

  @Output('onSelectPassAllSelected')
  onSelectPassAllSelected: EventEmitter<ListItem[]> = new EventEmitter<Array<any>>();

  @Output('onDeSelectPassItem')
  onDeSelectPassItem: EventEmitter<ListItem> = new EventEmitter<any>();

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  onFilterTextChange($event) {
    this.onFilterChange.emit($event);
  }

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef,
    private zone: NgZone) {
  }

  onItemClick($event: any, item: ListItem) {
    if (this.disabled) {
      return false;
    }

    const found = this.isSelected(item);
    const allowAdd =
      this._settings.limitSelection === -1 ||
      (this._settings.limitSelection > 0 &&
        this.selectedItems.length < this._settings.limitSelection);
    if (!found) {
      if (allowAdd) {
        this.addSelected(item);
      }
    } else {
      this.removeSelected(item);
    }
    if (
      this._settings.singleSelection &&
      this._settings.closeDropDownOnSelection
    ) {
      this.closeDropdown();
    }
  }


  writeValue(value: any) {
    this.zone.run(() => {
      if (value !== undefined && value !== null && value.length > 0) {
        if (this._settings.singleSelection) {
          try {
            if (value.length >= 1) {
              const firstItem = value[0];
              this.selectedItems = [
                typeof firstItem === 'string'
                  ? new ListItem(firstItem)
                  : new ListItem({
                    id: this._settings.isChildField ? firstItem[this._settings.idParentField][this._settings.idField] : firstItem[this._settings.idField],
                    text: this._settings.isChildField ? firstItem[this._settings.idParentField][this._settings.textField] : firstItem[this._settings.textField]
                  })
              ];
            }
          } catch (e) {
            // console.error(e.body.msg);
          }
        } else {
          const _data = [];
          value.map(
            (item: any) => {
              const find = this._data.find(x => x.id == item);
              if (find) {
                _data.push(find);
              }
            }
          );
          if (this._settings.limitSelection > 0) {
            this.selectedItems = _data.splice(0, this._settings.limitSelection);
          } else {
            this.selectedItems = _data;
          }
        }
      } else {
        this.selectedItems = [];
      }
      // console.log("selectedItem ", this.selectedItems);
      // console.log("onChangeCallback value", value);
      // this.onChangeCallback(value);
      setTimeout(() => {
        if (this.cdr && !(this.cdr as ViewRef).destroyed) {
          this.cdr.detectChanges();
        }
      });
    });
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  // Set touched on blur
  @HostListener('blur')
  public onTouched() {
    this.closeDropdown();
    this.onTouchedCallback();
  }

  trackByFn(index, item) {
    return item.id;
  }

  isSelected(clickedItem: ListItem) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  isLimitSelectionReached(): boolean {
    return this._settings.limitSelection === this.selectedItems.length;
  }

  isAllItemsSelected(): boolean {
    return this._data.length === this.selectedItems.length;
  }

  showButton(): boolean {
    if (!this._settings.singleSelection) {
      if (this._settings.limitSelection > 0) {
        return false;
      }
      // this._settings.enableCheckAll = this._settings.limitSelection === -1 ? true : false;
      return true; // !this._settings.singleSelection && this._settings.enableCheckAll && this._data.length > 0;
    } else {
      // should be disabled in single selection mode
      return false;
    }
  }

  itemShowRemaining(): number {
    return this.selectedItems.length - this._settings.itemsShowLimit;
  }

  addSelected(item: ListItem) {
    this.zone.run(() => {
      if (this._settings.singleSelection) {
        this.selectedItems = [];
        this.selectedItems.push(item);
      } else {
        if (this.selectedItems.filter(e => e.id === item.id).length <= 0) {
          this.selectedItems.push(item);
        }
      }
      this.onSelectPassAllSelected.emit(this.selectedItems);
      this.onChangeCallback(this.emittedValue(this.selectedItems));
      this.onSelect.emit(this.emittedValue(item));
    });
  }

  removeSelected(itemSel: ListItem) {
    this.selectedItems.forEach(item => {
      if (itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChangeCallback(this.emittedValue(this.selectedItems));
    this.onDeSelectPassItem.emit(itemSel);
    this.onDeSelect.emit(this.emittedValue(itemSel));
  }

  emittedValue(val: any): any {
    const selected = [];
    if (Array.isArray(val)) {
      val.map(item => {
        // if (item.id === item.text) {
        //   selected.push(item.text);
        // } else {
        selected.push(item.id);
        // }
      });
    } else {
      if (val) {
        // if (val.id === val.text) {
        //   return val.text;
        // } else {
        return val.id;
        // }
      }
    }
    return selected;
  }

  objectify(val: ListItem) {
    const obj = {};
    obj[this._settings.idField] = val.id;
    obj[this._settings.textField] = val.text;
    return obj;
  }

  toggleDropdown(evt) {
    evt.preventDefault();
    this.onClick.emit();
    if (this.disabled && this._settings.singleSelection) {
      return;
    }
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this._settings.defaultOpen) {
      this.onDropDownClose.emit();
    }
  }

  closeDropdown() {
    this._settings.defaultOpen = false;
    // clear search text
    if (this._settings.clearSearchFilter) {
      this.filter.text = '';
    }
    this.onDropDownClose.emit();
  }

  toggleSelectAll() {
    if (this.disabled) {
      return false;
    }
    if (!this.isAllItemsSelected()) {
      this.selectedItems = this._data.slice();
      this.onChangeCallback(this.emittedValue(this.selectedItems));
      this.onSelectAll.emit(this.emittedValue(this.selectedItems));
      this.onSelectPassAllSelected.emit(this.selectedItems);
    } else {
      this.selectedItems = [];
      this.onChangeCallback(this.emittedValue(this.selectedItems));
      this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
      this.onSelectPassAllSelected.emit([]);
    }
  }

  toggleSelectAllRest() {
    this.selectedItems = [];
    this.onChangeCallback(this.emittedValue(this.selectedItems));
  }


}
