import { InjectionToken } from "@angular/core";

export interface IAppConfig {
    CLIENT_ID: string;
    PAGE_SIZE: number;
    SCOPES: string;
    TENANTCORE_ID: string;
    USE_AUTH: string;
}
export const APP_CONFIG_DI: IAppConfig = {
    CLIENT_ID: 'a3a3b45c-3665-44b2-931a-f840fdfca572',
    PAGE_SIZE: 20,
    SCOPES: 'offline_access',
    TENANTCORE_ID: '7fa8058b-29bd-4184-b7a7-eef4c4a5a5a5',
    USE_AUTH: 'CORE'
};

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');
