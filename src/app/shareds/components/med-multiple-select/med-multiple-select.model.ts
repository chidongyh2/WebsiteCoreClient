export interface IMultiSelectSettings {
    singleSelection?: boolean;
    idField?: string;
    idParentField?: string;
    textField?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    allowSearchFilter?: boolean;
    clearSearchFilter?: boolean;
    maxHeight?: number;
    itemsShowLimit?: number;
    limitSelection?: number;
    searchPlaceholderText?: string;
    noDataAvailablePlaceholderText?: string;
    closeDropDownOnSelection?: boolean;
    showSelectedItemsAtTop?: boolean;
    isChildField?: boolean;
    defaultOpen?: boolean;
  }
  
  export class ListItem {
    id: String;
    text: String;
    selected?: boolean;
  
    public constructor(source: any) {
      if (typeof source === 'string') {
        this.id = this.text = source;
      }
      if (typeof source === 'object') {
        this.id = source.id;
        this.text = source.text;
        this.selected = source.selected;
      }
    }
  
  }