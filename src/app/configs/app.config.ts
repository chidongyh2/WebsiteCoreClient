import { InjectionToken } from "@angular/core";

export interface IAppConfig {
    CLIENT_ID: string;
    PAGE_SIZE: number;
    SCOPES: string;
    TENANTCORE_ID: string;
    USE_AUTH: string;
    CLIEN_SECRET: string;
}
export const APP_CONFIG_DI: IAppConfig = {
    CLIENT_ID: 'admin',
    PAGE_SIZE: 20,
    SCOPES: 'LIS_Core_Api LIS_Gateway_Api offline_access',
    TENANTCORE_ID: '7fa8058b-29bd-4184-b7a7-eef4c4a5a5a5',
    USE_AUTH: 'CORE',
    CLIEN_SECRET: 'LIS_admin_secret',

};

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');
