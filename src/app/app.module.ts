import { SharedModule } from './shareds/shared.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SettingsModule } from './core/settings';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuardService } from './shareds/services/auth-guard.service';
import { AppService } from './shareds/services/app.service';
import { ClickOutsideModule } from 'ng-click-outside';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    ClickOutsideModule,
    // FEATURE
    SettingsModule
  ],
  providers: [AuthService, AuthGuardService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
