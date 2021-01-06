
export class Page {
    id: number;
    isActive: boolean;
    url: string;
    icon: string;
    bgColor: string;
    order: number;
    parentId?: number;
    name: string;
    description: string;
    isShowSidebar: boolean

    constructor(id?: number, name?: string, description?: string, isActive?: boolean, isShowSidebar?: boolean, url?: string, icon?: string, order?: number, parentId?: number) {
        this.id = id;
        this.isActive = isActive || true;
        this.url = url ? url : '';
        this.icon = icon ? icon : '';
        this.order = 0;
        this.parentId = parentId;
        this.name = name;
        this.description = description;
        this.isShowSidebar = isShowSidebar || true;
    }
}