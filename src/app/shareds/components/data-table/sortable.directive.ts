import { Directive, Input, HostBinding, HostListener, Output, EventEmitter } from '@angular/core'
import { DataTableColumnMetadata } from './data-table-metadata'

@Directive({
  selector: '[sortable]'
})
export class SortableDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('sortable') column: DataTableColumnMetadata
  @Input() sort: string
  @Output() sorted = new EventEmitter()

  constructor() { }

  @HostListener('click')
  click() {
    if (!this.isSortable) {
      return
    }
    let sort = ''
    if (this.isSortAscending) {
      sort = `-${this.column.fieldName}`
    } else if (this.isSortDescending) {
      sort = this.column.fieldName
    } else {
      sort = this.column.fieldName
    }
    this.sorted.emit(sort)
  }

  @HostBinding('class.sortable')
  get isSortable(): boolean {
    return this.column.sortable
  }

  @HostBinding('class.sort-asc')
  get isSortAscending(): boolean {
    if (!this.column.sortable) {
      return false
    }

    if (!this.sort) {
      return false
    }

    return this.sort === this.column.fieldName
  }

  @HostBinding('class.sort-desc')
  get isSortDescending(): boolean {
    if (!this.column.sortable) {
      return false
    }

    if (!this.sort) {
      return false
    }

    return this.sort === `-${this.column.fieldName}`
  }
}
