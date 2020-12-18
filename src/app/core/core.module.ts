import { CoreInterceptorService } from './interceptors/core-interceptor.service';
import { CommonModule, registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import localeVi from '@angular/common/locales/vi';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { reducers, metaReducers } from "./states/core.state";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalStorageService } from "./local-storage/local-storage.service";
import { APP_CONFIG, APP_CONFIG_DI } from '../configs/app.config';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

registerLocaleData(localeVi, 'vi')

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        // ngrx
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule.forRoot(),
        EffectsModule.forRoot(),
        ToastrModule.forRoot(),
        StoreDevtoolsModule.instrument({
            name: 'Angular NgRx Material Starter'
          }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),

    ],
    declarations: [],
    providers: [
        LocalStorageService,
        { provide: HTTP_INTERCEPTORS, useClass: CoreInterceptorService, multi: true },
        { provide: APP_CONFIG, useValue: APP_CONFIG_DI },
    ],
    exports: [
        TranslateModule
    ]
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
      ) {
        if (parentModule) {
          throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
      }
}