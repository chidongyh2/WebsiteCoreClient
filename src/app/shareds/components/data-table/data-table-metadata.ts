export interface DataTableMetadata {
  cssClass?: string
  sort?: string
  selectMode?: DataTableSelectMode
  noResultMessage?: string
  noResultDescription?: string
  noResultIcon?: string
  noResultImage?: string
  noResultNoBorders?: boolean
  canSelectAll?: boolean
  canSelectColumns?: boolean
  trackBy?: string
  columns?: DataTableColumnMetadata[]
}

export interface DataTableColumnMetadata {
  name: string
  description?: string,
  fieldName?: string
  sortable?: boolean
  order?: number
  dateTimeFormat?: string
  templateName?: string
  displayType: DataTableDataDisplayType
  fallback?: string
  headerCss?: string
  rowCss?: string
  width?: string
  align?: 'right' | 'center' | 'left'
}

export enum DataTableSelectMode {
  none = 0,
  single = 1,
  multiple = 2,
}

export enum DataTableDataDisplayType {
  index = 0,
  text,
  datetime,
  template,
}

export enum DataTableColumnDisplayMode {
  always = 1,
  hidden = 2,
  visible = 3,
}
