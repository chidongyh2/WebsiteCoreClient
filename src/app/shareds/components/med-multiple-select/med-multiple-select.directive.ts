import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from './med-multiple-select.model';

@Pipe({
  name: 'multiSelectListFilter',
  pure: false
})
export class MedMultiSelectListFilterPipe implements PipeTransform {
  transform(items: ListItem[], filter: ListItem): ListItem[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: ListItem) => this.applyFilter(item, filter));
  }

  applyFilter(item: ListItem, filter: ListItem): boolean {
    return !(filter.text && item.text && item.text.toLowerCase().indexOf(filter.text.toLowerCase()) === -1);
  }
}
