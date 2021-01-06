import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ITreeSettings } from '../med-tree.interface';
import * as _ from 'lodash';
@Component({
  selector: 'med-tree',
  templateUrl: './med-tree.component.html',
  styleUrls: ['./med-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('toogleTreeSubmenu', [
      state(
        'sub-tree-open',
        style({
          height: '*',
          opacity: '1',
          display: 'block'
        })
      ),
      state(
        'sub-tree-close',
        style({
          height: '0',
          opacity: '0',
          display: 'none'
        })
      ),
      transition('sub-tree-open => sub-tree-close', [
        animate(
          150,
          style({
            height: '0'
          })
        )
      ]),
      transition('sub-tree-close => sub-tree-open', [
        animate(
          150,
          style({
            height: '*'
          })
        )
      ])
    ])
  ]
})
export class MedTreeComponent implements OnInit {
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
  @Input() isMultiple = false;
  @Input() isChildren = false;
  @Input() isOpen = true;
  @Input() height = 250;
  @Input() isChoseParent = true;
  @Input() lazyLoadURL;
  // @Input() selectedIds = [];

  @Output() nodeSelected = new EventEmitter();
  @Output() nodeExpanded = new EventEmitter();

  private _data: any[] = [];
  private _selectedIds: string[] | number[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  @Input()
  public set dataDisable(data: any[]) {
    setTimeout(() => {
      if(data && data.length > 0) {
        data.map((item) => {
          this.setDisableItem(this._data, item[this._settings.idField]);
        });
      }
    });
  }

  setDisableItem(data: any[], parentId: string | number) {
    const itemfind = data.find(x => x[this._settings.idField] === parentId);
    if (itemfind) {
      itemfind.isDisabled = true;
    } else {
      _.each(data, (itemData: any) => {
        itemData.isDisabled = false;
        if (itemData[this._settings.childrenKey] && itemData[this._settings.childrenKey].length > 0) {
          this.setDisableItem(itemData[this._settings.childrenKey], parentId);
        }

      });
    }
  }

  @Input()
  public set settings(value: ITreeSettings) {
    if (value) {
      this._settings = Object.assign(this.defaultSettings, value);
    } else {
      this._settings = Object.assign(this.defaultSettings);
    }
  }

  selectNode(node: any) {
    if (this.isChoseParent) {
      if (!this.isMultiple) {
        this.resetSelectedNote(this.data);
        node.isSelected = true;
      } else {
        node.isSelected = !node.isSelected;
      }
      this.nodeSelected.emit(node);
    } else {
      if (!node.isDisabled && (!node[this._settings.childrenKey]
        || (node[this._settings.childrenKey] && node[this._settings.childrenKey].length === 0))) {
        if (!this.isMultiple) {
          this.resetSelectedNote(this.data);
          node.isSelected = true;
        } else {
          node.isSelected = !node.isSelected;
        }
        this.nodeSelected.emit(node);
      }
    }
  }

  expand(node: any) {
    if (this.lazyLoadURL && node[this._settings.childrenKey].length === 0) {
      node.isLoading = true;
      const childrens = this.http.get(`${this.lazyLoadURL}${node.id}`);
      childrens.subscribe((result: any) => {
        node.isLoading = false;
        node[this._settings.childrenKey] = result;
      });
    }
    node.opened = !node.opened;
    this.nodeExpanded.emit(node);
  }

  private resetSelectedNote(treeNodes: any[], parentId?: number) {
    if (!treeNodes || treeNodes.length <= 0) {
      return;
    }

    _.each(treeNodes, (node: any) => {
      node.isSelected = false;

      // if (node.parentId === parentId) {
      _.each(node[this._settings.childrenKey], (item: any) => {
        item.isSelected = false;
        this.resetSelectedNote(item[this._settings.childrenKey], item[this._settings.idField]);
      });
      // }
    });
  }

  @Input()
  set data(value: any[]) {
    this._data = _.cloneDeep(value);
    setTimeout(() => {
      this.updateSelectedStatus(this.data);
    });
  }

  get data() {
    return this._data;
  }

  @Input()
  set selectedIds(value: string[] | number[]) {
    this._selectedIds = _.cloneDeep(value);
    setTimeout(() => {
      this.updateSelectedStatus(this.data);
    });
  }

  get selectedIds() {
    return this._selectedIds;
  }

  private updateSelectedStatus(nodes: any[], parentId: string | number = null) {
    const parentNodes = _.filter(nodes, (node: any) => {
      return node[this._settings.parentKey] === parentId;
    });
    if (parentNodes && parentNodes.length > 0) {
      _.each(parentNodes, (nodeItem: any) => {
        nodeItem.isSelected =
          this.selectedIds &&
          this.selectedIds.length > 0 &&
          this.selectedIds
            .toString()
            .indexOf(nodeItem[this._settings.idField].toString()) > -1;

        this.updateSelectedStatus(nodeItem[this._settings.childrenKey], nodeItem[this._settings.idField]);
      });
    }
  }
}

