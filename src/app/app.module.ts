import { SharedModule } from './shareds/shared.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SettingsModule } from './core/settings';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuardService } from './shareds/services/auth-guard.service';
import { AppService } from './shareds/services/app.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { SystemManager } from './core/services/system-manager.service';
import { setAppInjector } from './shareds/helpers/app-injector';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ClickOutsideModule,
    // FEATURE
    SettingsModule
  ],
  providers: [AuthService, AuthGuardService, AppService, SystemManager,
    { provide: 'SYSTEM_MANAGER', useValue: SystemManager },
    { provide: 'APP_SERVICE', useValue: AppService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
