import { InjectionToken } from "@angular/core";

export interface IPageId {
    NONE: number;
    // ------ CONFIG: 1 ------
    CONFIG: number;
    CONFIG_PAGE: number;
    CONFIG_CLIENT: number;
    CONFIG_TENANT: number;
    CONFIG_ROLE: number;
    CONFIG_ACCOUNT: number;
}
export const PAGE_ID_DI: IPageId = {
    NONE: -1,

    // ------ CONFIG: 1 ------
    CONFIG: 1,
    CONFIG_PAGE: 2,
    CONFIG_ROLE: 3,
    CONFIG_CLIENT: 4,
    CONFIG_TENANT: 5,
    CONFIG_ACCOUNT: 6,
}
// Injection Tokens
export let PAGE_ID = new InjectionToken<IPageId>('page.config');
