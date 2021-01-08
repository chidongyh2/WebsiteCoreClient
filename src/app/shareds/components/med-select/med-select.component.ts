import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import {GlobalPositionStrategy, Overlay, OverlayRef} from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { ISelectSettings } from './med-select-settings.model';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
const noop = () => { };

@Component({
  selector: 'med-select',
  templateUrl: './med-select.component.html',
  styleUrls: ['./med-select.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MedSelectComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => MedSelectComponent), multi: true}
  ],
  encapsulation: ViewEncapsulation.None
})
export class MedSelectComponent implements OnInit, ControlValueAccessor, OnDestroy, AfterViewInit {
  private _data: any[] = [];
  private _selectedItem = null;
  @ViewChild('dropdownTemplate') dropdownTemplate: TemplateRef<any>;
  @ViewChild('modalAcceptChangeEvent') modalAcceptChangeEvent: SwalComponent;
  @Input() multiple = false;
  @Input() liveSearch = false;
  @Input() icon = 'fa fa-info-circle';
  @Input() title: string;
  @Input() isEnable = true;
  @Input() isInsertValue = false;
  @Input() url: string;
  @Input() loading: boolean;
  @Input() pageSize = 10;
  @Input() readonly = false;
  @Input() selectedItems = [];
  @Input() elementId = 'elementId';
  @Input() classColor = '';
  @Input() width;
  @Input() isShowRemove = false;

  @Output() itemSelected = new EventEmitter();

  @Output() valueChange = new EventEmitter();

  @Output() shown = new EventEmitter();

  @Output() hidden = new EventEmitter();

  @Output() valueInserted = new EventEmitter();

  @Output() keywordPressed = new EventEmitter();

  private onTouchedCallback: () => void = noop;
  public _settings: ISelectSettings;
  isSearching = false;
  source = [];
  label;
  inputId;
  itemTemp = null;
  currentPage = 1;
  totalRows = 0;
  totalPages = 0;
  private _value: any;
  private overlayRef: OverlayRef;
  private positionStrategy = new GlobalPositionStrategy();
  searchTerm$ = new BehaviorSubject<string>(null);
  propagateChange: any = () => {
  };
  defaultSettings: ISelectSettings = {
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
    defaultOpen: false
  };

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private http: HttpClient,
    private el: ElementRef, private renderer: Renderer2
  ) {
    this.inputId = `mp-select-${new Date().getTime() + Math.floor((Math.random() * 10) + 1)}`;
    this._settings = this.defaultSettings;
  }

  ngAfterViewInit() {
    // this.overlayRef = this.overlay.create({
    //   positionStrategy: this.positionStrategy
    // });
    // console.log(this.overlayRef);
  }

  ngOnDestroy() {
    this.dismissMenu();
  }

  ngOnInit() {
  }

  @Input()
  set data(values: any[]) {
    setTimeout(() => {
      if (values) {
        this._data = values;
        this.source = values.map((item, index, aarray) => {
          let obj = item;
          obj = Object.assign({}, obj, {index: index});
          obj = Object.assign({}, obj, {active: false});

          if (this.value && this.value instanceof Array) {
            aarray[index] = Object.assign({}, item, {selected: this.value.indexOf(item[this._settings.idField]) > -1});
            obj = Object.assign({}, obj, {selected: this.value.indexOf(item[this._settings.idField]) > -1});
          } else {
            aarray[index] = Object.assign({}, item, {selected: item[this._settings.idField] === this.value});
            obj = Object.assign({}, obj, {selected: item[this._settings.idField] === this.value});
          }
          return obj;
        });
        const labelName = this.source.filter((item: any) => {
          return item.selected;
        }).map(item => item[this._settings.textField]).join(',');

        if (labelName) {
          this.label = labelName;
        }
      }
    });
  }

  @Input()
  public set settings(value: ISelectSettings) {
    if (value) {
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  @Input()
  set value(val) {
    if (val != null) {
      if (val instanceof Array) {
        this._value = val;
        const selectedItem = _.filter(this.source, (item) => {
          return val.indexOf(item[this._settings.idField]) > -1;
        });

        if (selectedItem && selectedItem.length > 0) {
          _.each(selectedItem, (item) => {
            item.selected = true;
          });
          this.label = this.getSelectedName(selectedItem);
        } else {
          this.label = this.title;
        }
      } else {
        this.getSelectedItem(val);
      }
    } else {
      if (this.multiple) {
        this.getSelectedItem(val);
      } else {
        this.label = this.title;
      }
    }
  }

  @Input()
  set selectedItem(value) {
    this._selectedItem = value;
    if (value) {
      this.label = value[this._settings.textField] ? value[this._settings.textField] : this.title;
    } else {
      this.label = null;
    }
  }

  get value() {
    return this._value;
  }

  get data() {
    return this._data;
  }

  private getSelectedItem(val) {
    _.each(this.source, (item) => {
      if (item[this._settings.idField] === val) {
        this.label = item[this._settings.textField];
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this._value = val;
    this.valueChange.emit(this._value);
  }

  private getSelectedName(listItem): string {
    return listItem.map((item) => {
      return item[this._settings.textField];
    }).join(', ');
  }

  private navigate(key: number) {
    const selectedItem = this.source.find((item) => {
      return item.active;
    });

    switch (key) {
      case 37:
        this.back(selectedItem);
        break;
      case 38:
        this.back(selectedItem);
        break;
      case 39:
        this.next(selectedItem);
        break;
      case 40:
        this.next(selectedItem);
        break;
      case 13:
        if (selectedItem) {
          this.itemTemp = selectedItem;
          this.selectItem();
        }
        break;
    }
  }

  confirmSelect(item: any) {
    this.itemTemp = item;
    if (this._settings.isConfirm) {
      this.modalAcceptChangeEvent.fire();
    } else {
      this.selectItem();
    }
  }

  selectItem() {
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this.multiple) {
      this.label = this.itemTemp[this._settings.textField];
      _.each(this.source, (data) => {
        data.selected = false;
      });
      this.itemTemp.selected = true;
      this.value = this.itemTemp[this._settings.idField];
      this.propagateChange(this.itemTemp[this._settings.idField]);
      this.itemSelected.emit(this.itemTemp);
      this.dismissMenu();
    } else {
      this.itemTemp.selected = !this.itemTemp.selected;
      const selectedItem = _.filter(this.source, (source: any) => {
        return source.selected;
      });
      this.label = selectedItem && selectedItem.length > 0 ? this.getSelectedName(selectedItem) : this.title;

      if (this.value instanceof Array) {
        const selectedIds = selectedItem.map((selected) => {
          return selected[this._settings.idField];
        });
        this.itemSelected.emit(selectedItem);
        this.propagateChange(selectedIds);
      } else {
        this.itemSelected.emit(selectedItem);
        this.propagateChange(this.itemTemp[this._settings.idField]);
      }
    }
  }

  private next(selectedItem: any) {
    if (!selectedItem) {
      const firstItem = this.source[0];
      if (firstItem) {
        firstItem.active = true;
      }
    } else {
      let index = selectedItem.index + 1;
      if (index > this.source.length - 1) {
        index = 0;
      }

      const currentItem = this.source[index];
      this.resetActiveStatus();
      currentItem.active = true;
    }
  }

  private back(selectedItem: any) {
    if (!selectedItem) {
      const lastItem = this.source[this.source.length - 1];
      if (lastItem) {
        lastItem.active = true;
      }
    } else {
      let index = selectedItem.index - 1;
      if (index < 0) {
        index = this.source.length - 1;
      }

      const currentItem = this.source[index];
      this.resetActiveStatus();
      currentItem.active = true;
    }
  }

  private resetActiveStatus() {
    this.source.forEach((item) => item.active = false);
  }

  @HostListener('blur')
  public onTouched() {
    this.cancelConfirm();
    this.onTouchedCallback();
  }

  toggleDropdown(evt) {
    evt.preventDefault();
    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy
    });
    this._settings.defaultOpen = !this._settings.defaultOpen;
    if (!this._settings.defaultOpen) {
      // this.onDropDownClose.emit();
    }
  }

  close() {
    this._settings.defaultOpen = !this._settings.defaultOpen;
  }

  private dismissMenu() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.hidden.emit();
    }
  }

  private search(searchTerm?: string) {
    this.source = [];
    this.isSearching = true;
    if (!this.url) {
      this.isSearching = false;
      return;
    }
    this.http
      .get<any>(this.url, {
        params: new HttpParams()
          .set('keyword', searchTerm ? searchTerm : '')
          .set('pageSize', this.pageSize ? this.pageSize.toString() : '10')
      })
      .pipe(
        finalize(() => this.isSearching = false)
      )
      .subscribe((result: any) => {
        const items = result.items;
        this.totalRows = result.totalRows;
        this.paging();
        this.source = items.map((item, index) => {
          const obj = item;
          obj.index = index;
          obj.active = false;
          obj.selected = false;
          return obj;
        });
      });
  }

  searchKeyUp(e, term) {
    const keyCode = e.keyCode;
    // Navigate
    if (keyCode === 27) {
      // Check
    }

    if (keyCode === 27 || keyCode === 17 || e.ctrlKey) {
      return;
    }

    if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 13) {
      this.navigate(keyCode);
      e.preventDefault();
    } else {
      if (!term) {
        this.source = this.data.map((item, index) => {
          const obj = item;
          obj.index = index;
          obj.active = false;
          obj.selected = false;
          return obj;
        });
        return;
      }
      if (this.url) {
        this.searchTerm$.next(term);
      } else {
        const searchResult = _.filter(this.data, (item) => {
          return this.stripToVietnameChar(item[this._settings.textField]).indexOf(this.stripToVietnameChar(term)) > -1;
        });
        this.source = searchResult.map((item, index) => {
          const obj = item;
          obj.index = index;
          obj.active = false;
          obj.selected = false;
          return obj;
        });
      }
    }
  }

  private paging() {
    const pageSize = this.pageSize ? this.pageSize : 10;
    this.totalPages = Math.ceil(this.totalRows / pageSize);
  }

  insertValue() {
    this.label = this.searchTerm$.value;
    this.valueInserted.emit(this.searchTerm$.value);
  }

  remove(e) {
    e.preventDefault();
    this.clear();
    this.value = null;
    this.itemSelected.emit(null);
  }

  stripToVietnameChar(str): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value) {
    if (value != null && value !== undefined && value !== '') {
      this.value = value;
      this.label = this.title;
    } else {
      this.label = this.title;
    }
  }

  buttonClick() {
    if (this.url && this.liveSearch) {
      this.search('');
    }
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  validate(c: FormControl) {
    this.value = c.value;
  }
  // @HostListener('document:click', ['$event', '$event.target'])
  // public onClick(event: MouseEvent, targetElement: HTMLElement): void {
  //   if (this.overlayRef) {
  //     const clickedInside = this.el.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //       this._settings.defaultOpen = !this._settings.defaultOpen;
  //     }
  //   }
  // }
  clear() {
    this.selectedItems = [];
    this.label = this.title;
  }
  cancelConfirm() {
    this._settings.defaultOpen = false;
  }

  outSizeClick() {
    this._settings.defaultOpen = false;
  }
}
