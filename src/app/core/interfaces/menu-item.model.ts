export interface MenuItem {
    id: number;
    IdPath?: string;
    shortLabel?: string;
    mainState?: string;
    target?: boolean;
    name: string;
    url?: string;
    type?: MenuItemType;
    icon: string;
    children?: MenuItem[];
    isShowSidebar?: boolean;
    childCount?: number;
    order?: number;
    orderPath?: string;
    parentId?: number;
    code: string;
    parentCode: string;
  }
  
  export interface BadgeItem {
    type: string;
    value: string;
  }

  export enum MenuItemType {
    sub, // for parent menu
    tab, // for tab
    url, // for url
    modal, // for open modal
  }