import { marker } from "@biesbjerg/ngx-translate-extract-marker";
import { DataTableDataDisplayType, DataTableMetadata, DataTableSelectMode } from "src/app/shareds/components/data-table/data-table-metadata";

export const PageListMetadata: DataTableMetadata = {
    cssClass: 'table-framed',
    selectMode: DataTableSelectMode.none,
    noResultMessage: marker('noResults.courses'),
    noResultIcon: 'far fa-chalkboard',
    columns: [{
      name: 'STT',
      displayType: DataTableDataDisplayType.index,
      width: '40px',
      rowCss: 'text-center',
      headerCss: 'text-center'
    }, {
      name: marker('pages.label.name'),
      fieldName: 'name',
      displayType: DataTableDataDisplayType.text,
      width: '40%',
      sortable: true
    }, {
      name: marker('pages.label.icon'),
      templateName: 'icon',
      displayType: DataTableDataDisplayType.template,
      headerCss: 'text-center',
      rowCss: 'text-center',
      width: '20%'
    }, {
      name: marker('pages.label.isActive'),
      templateName: 'isActive',
      displayType: DataTableDataDisplayType.template,
    }, {
      name: marker('pages.label.isShowSidebar'),
      fieldName: 'isShowSidebar',
      templateName: 'isShowSidebar',
      displayType: DataTableDataDisplayType.template,
      headerCss: 'text-center',
      rowCss: 'text-center',
    },
    {
      name: marker('table.action'),
      displayType: DataTableDataDisplayType.template,
      templateName: 'action',  
      headerCss: 'text-center',
      rowCss: 'text-muted text-center',
      width: '130px'
    }]
  }