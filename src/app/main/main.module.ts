import { SharedModule } from 'src/app/shareds/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PageListComponent } from './modules/configs/page/page-list/page-list.component';
import { PageFormComponent } from './modules/configs/page/page-form/page-form.component';
import { AccountListComponent } from './modules/configs/account/account-list/account-list.component';
import { AccountFormComponent } from './modules/configs/account/account-form/account-form.component';
import { MenuListComponent } from './modules/configs/menu/menu-list/menu-list.component';
import { MenuFormComponent } from './modules/configs/menu/menu-form/menu-form.component';
import { RoleListComponent } from './modules/configs/role/role-list/role-list.component';
import { RoleFormComponent } from './modules/configs/role/role-form/role-form.component';
@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ],
  declarations: [
    MainComponent,
    DashboardComponent,
    PageListComponent,
    PageFormComponent,
    AccountListComponent,
    AccountFormComponent,
    MenuListComponent,
    MenuFormComponent,
    RoleListComponent,
    RoleFormComponent
  ],
})
export class MainModule { }
