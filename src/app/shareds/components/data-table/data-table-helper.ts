import { TranslateService } from '@ngx-translate/core'
import { DataTableMetadata } from './data-table-metadata'
import { DataTableModule } from './data-table.module'

let _translateService: TranslateService

const _translateStr = (str: string): string => {
  return str && _translateService.instant(str)
}

export const translateMetadata = (metadata: DataTableMetadata, translateService: TranslateService): DataTableMetadata => {
  _translateService = translateService
  const translatedMetadata = Object.assign(metadata, {
    noResultMessage: _translateStr(metadata.noResultMessage),
    noResultDescription: _translateStr(metadata.noResultDescription),
    columns: (metadata.columns || []).map(col => {
      return Object.assign(col, {
        name: _translateStr(col.name),
        description: _translateStr(col.description)
      })
    })
  })
  return translatedMetadata
}
