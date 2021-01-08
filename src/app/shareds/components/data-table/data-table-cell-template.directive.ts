import { Directive, TemplateRef, Input } from '@angular/core'

@Directive({
  selector: '[cell-template]'
})
export class DataTableCellTemplateDirective {
  @Input('cell-template') templateName: string

  constructor(public templateRef: TemplateRef<any>) { }

}
