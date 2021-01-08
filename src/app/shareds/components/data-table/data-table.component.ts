import {
  Component,
  OnInit,
  OnChanges,
  ContentChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core'
import { get } from 'lodash'
import { DataTableCellTemplateDirective } from './data-table-cell-template.directive'
import {
  DataTableMetadata,
  DataTableDataDisplayType,
  DataTableSelectMode,
  DataTableColumnMetadata,
} from './data-table-metadata'
import { RowSelection } from './row-selection'
import { v4 } from 'uuid'
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  providers: [ DatePipe ]
})
export class DataTableComponent implements OnInit, OnChanges {
  @ContentChild('hoverCardTemplate', { static: false })
  hoverCardTemplateRef: TemplateRef<any>
  @ContentChildren(DataTableCellTemplateDirective) cellTemplates: QueryList<DataTableCellTemplateDirective>

  @Input() metadata: DataTableMetadata
  @Input() isLoading: boolean
  @Input() data: any[]
  @Input() page: number
  @Input() quantity: number
  @Input() selectedIds = new Set()
  @Input() selections: RowSelection[]
  @Input() resetSelectionOnChange = true
  @Output() sorted = new EventEmitter()
  @Output() selected = new EventEmitter()
  @Output() rowClicked = new EventEmitter()
  id = v4()

  DataTableDataDisplayType = DataTableDataDisplayType
  DataTableSelectMode = DataTableSelectMode
  columns: DataTableColumnMetadata[] = []
  isSelectedAll: boolean

  private get trackBy() {
    return this.metadata.trackBy || 'id'
  }

  constructor(private datePipe: DatePipe, private translate: TranslateService) {}

  ngOnInit() {
    this.prepare()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      if (this.resetSelectionOnChange) {
        this.selectedIds = new Set()
        this.isSelectedAll = false
      }
      if (this.selections) {
        const items = this.data || []
        items.forEach(t => {
          const selection = this.selections.filter(
            x => x.id === get(t, this.trackBy, t),
          )[0]
          if (selection && selection.selected) {
            this.selectedIds.add(get(t, this.trackBy, t))
          }
        })
      }
    }
  }

  configureColumns() {
    // do something
  }

  getIndex(index: number) {
    return ((this.page || 1) - 1) * (this.quantity || 0) + (index + 1)
  }

  getText(rowData: any, column: DataTableColumnMetadata) {
    const value = column.fieldName
      ? get(rowData, column.fieldName)
      : column.fallback
    return value === undefined ? '-' : value
  }

  getDate(rowData: any, column: DataTableColumnMetadata) {
    const value = column.fieldName ? get(rowData, column.fieldName) : undefined
    if (value) {
      return this.datePipe.transform(value, column.dateTimeFormat || 'dd/MM/yyyy')
    }
    return column.fallback ? this.translate.instant(column.fallback) : undefined
  }

  getTemplate(templateName: string): TemplateRef<any> {
    if (!this.cellTemplates) {
      return
    }
    const cell = this.cellTemplates.find(t => t.templateName === templateName)
    return cell && cell.templateRef
  }

  sort(sortField: string) {
    this.sorted.emit(sortField)
  }

  isChecked(item: any) {
    const itemId = get(item, this.trackBy, item)
    return this.selectedIds.has(itemId)
  }

  onChangedAll(isChecked: boolean) {
    this.isSelectedAll = isChecked
    if (isChecked) {
      const items = this.data || []
      items.forEach(t => {
        this.selectedIds.add(get(t, this.trackBy, t))
      })
    } else {
      this.selectedIds = new Set()
    }
    this.broadcastSelection()
  }

  onRowClicked(item: any) {
    this.rowClicked.emit(item)
  }

  onChanged(item: any, isChecked: boolean) {
    if (!isChecked) {
      this.isSelectedAll = false
    }
    const itemId = get(item, this.trackBy, item)

    if (this.metadata.selectMode === DataTableSelectMode.multiple) {
      if (isChecked) {
        this.selectedIds.add(itemId)
      } else {
        this.selectedIds.delete(itemId)
      }
      this.isSelectedAll =
        this.data && this.selectedIds.size === this.data.length
    }

    if (this.metadata.selectMode === DataTableSelectMode.single) {
      this.selectedIds = new Set()
      if (isChecked) {
        this.selectedIds.add(itemId)
      }
    }
    this.broadcastSelection()
  }

  private broadcastSelection() {
    const items = this.data || []
    const selection = items.map(t => {
      const id = get(t, this.trackBy, t)
      return {
        id: id,
        selected: this.selectedIds.has(id),
      }
    })
    this.selected.emit(selection)
  }

  private prepare() {
    this.columns = this.metadata.columns
      .map((value, index) => {
        if (!value.order) {
          value.order = index
        }
        return value
      })
      .sort((a, b) => (a.order > b.order ? 1 : -1))
  }
}
