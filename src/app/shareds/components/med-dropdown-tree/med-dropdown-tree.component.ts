import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import { ITreeSettings } from './med-tree.interface';
import * as _ from 'lodash';
@Component({
  selector: 'med-dropdown-tree',
  templateUrl: './med-dropdown-tree.component.html',
  styleUrls: ['./med-tree/med-tree.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MedDropdownTreeComponent), multi: true }
  ],
  encapsulation: ViewEncapsulation.None
})
export class MedDropdownTreeComponent implements OnInit, ControlValueAccessor {
  @Input() isMultiple = false;
  @Input() width = 250;
  @Input() acceptText = 'Có';
  @Input() cancelText = 'Không';

  @Input() isChoseParent = true;
  @Output() accepted = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  @Output() nodeExpanded = new EventEmitter();
  @Output() nodeSelected = new EventEmitter();
  @Output() nodeBeforeSelected = new EventEmitter();

  isShow = false;
  selectedTexts: string[] = [];
  selectTitle = '-- Vui lòng chọn giá trị --';
  listSelected: any[] = [];

  private _value: string | number;
  private _data: any[];
  public _dataDisable: any[];
  private _title: string;
  private _selectedText: string;

  private onTouchedCallback: () => void = noop;

  public _settings: ITreeSettings;
  defaultSettings: ITreeSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    parentKey: 'parentId',
    childrenKey: 'children',
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

  @Input()
  public set settings(value: ITreeSettings) {
    if (value) {
      this._settings = Object.assign(this.defaultSettings, value);
    }
  }

  @Input()
  public set dataDisable(data: any[]) {
    if (data && data.length > 0) {
      this._dataDisable = [...data];
    }
  }

  @Input()
  set title(value: string) {
    this._title = value;
    this.selectTitle = value;
  }

  get title() {
    return this._title;
  }

  constructor(private el: ElementRef) {
    this._settings = this.defaultSettings;
  }

  get value() {
    return this._value;
  }

  @Input()
  set value(value: string | number) {
    this._value = value;
    this.setSelectTitle();
  }

  @Input()
  set data(value: any[]) {
    if (value && value.length > 0) {
      this._data = _.cloneDeep([...value]);
      this.createIndexFlat(this._data, null);
      this.setSelectTitle();
    }
  }

  private createIndexFlat(data: any[], parentId: null) {
    _.each(data, (item, index, array) => {
      if (item[this._settings.childrenKey] && item[this._settings.childrenKey].length > 0) {
        this.createIndexFlat(item[this._settings.childrenKey], item[this._settings.parentKey]);
        array[index] = Object.assign({}, item, { childCount: item[this._settings.childrenKey].length });
      } else {
        array[index] = Object.assign({}, item, { opened: false, selected: false, isLoading: false, isDisabled: false });
      }
    });
  }

  get data() {
    return this._data;
  }

  @Input()
  set selectedText(value: string) {
    this._selectedText = value;
    this.selectTitle = value;
  }

  get selectedText() {
    return this._selectedText;
  }

  propagateChange: any = () => {
  };

  ngOnInit() {
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  writeValue(value) {
    this.value = value;
  }


  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      // or some similar check
      this.isShow = false;
    }
  }

  acceptButtonClick() {
    this.isShow = false;
    this.accepted.emit(this.listSelected);
    const selectedNodeName = _(this.listSelected)
      .map('text')
      .value()
      .toString();
    this.selectTitle = selectedNodeName ? selectedNodeName : this.title;
  }

  cancelButtonClick() {
    this.canceled.emit();
    this.isShow = false;
  }

  expandButtonClick() {
  }

  dropdownButtonClick() {
    this.onTouchedCallback();
    this.isShow = !this.isShow;
    if (!this.isMultiple) {
      this.buttonClicked.emit(this.isShow);
    }
  }

  onNodeSelected(node: any) {
    if (!this.isMultiple) {
      this.isShow = false;
      this.selectTitle = node[this._settings.textField];
      this.propagateChange(node[this._settings.idField]);
      this.nodeSelected.emit(node);
    } else {
      if (node.isSelected) {
        const isExists = _.find(this.listSelected, item => {
          return item[this._settings.idField] === node[this._settings.idField];
        });
        if (!isExists) {
          this.listSelected.push(node);
        }
      } else {
        _.remove(this.listSelected, node);
      }
    }
  }

  onNodeExpanded(node: any) {
    this.nodeExpanded.emit(node);
  }

  selectDefaultNode() {
    this.isShow = false;
    this.selectTitle = this.title;
    this.nodeSelected.emit(null);
    this.propagateChange(null);
    if (this.isMultiple) {
      this.accepted.emit(null);
    }
  }

  private getNodesSelected(data: any[], parentId?: any) {
    const listNodes = _.filter(data, (node: any) => {
      return node[this._settings.parentKey] === parentId;
    });
    if (listNodes) {
      _.each(listNodes, (node: any) => {
        if (this.value === node[this._settings.idField]) {
          this.selectedTexts.push(node[this._settings.textField]);
        } else {
          this.getNodesSelected(node[this._settings.childrenKey], node[this._settings.idField]);
        }
      });
    }
  }

  private getSelectedNode(data: any[]) {
    if (data && data.length > 0) {
      const selectedNode = _.find(data, (node: any) => {
        return node[this._settings.idField] === this.value;
      });
      if (selectedNode) {
        this.selectTitle = selectedNode[this._settings.textField];
      } else {
        _.each(data, (node: any) => {
          // if (node.id === this.value) {
          //     this.selectTitle = node.text;
          //     return false;
          // } else {
          //     this.selectTitle = this.title;
          this.getSelectedNode(node[this._settings.childrenKey]);
          // }
        });
      }
    }

  }

  private setSelectTitle() {
    if (this.isMultiple) {
      this.getNodesSelected(this.data, null);
      this.selectTitle = this.selectedTexts && this.selectedTexts.length > 0
        ? this.selectedTexts.join()
        : this.title;
    } else {
      this.getSelectedNode(this.data);
    }
  }

}
