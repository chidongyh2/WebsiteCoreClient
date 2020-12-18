export interface MenuItem {
    code: string;
    state: string;
    shortLabel?: string;
    mainState?: string;
    target?: boolean;
    name: string;
    external?: string;
    type?: string;
    icon: string;
    isReport?: boolean;
    children?: MenuItem[];
    menuId?: number;
    badge?: BadgeItem[];
    isShowSidebar?: boolean;
    parentCode: string;
    isEncyption?: boolean;
  }
  
  export interface BadgeItem {
    type: string;
    value: string;
  }