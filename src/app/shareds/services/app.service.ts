import { select } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/states/core.state';
import { environment } from "src/environments/environment";
import { RolePageViewModel } from '../view-model/role-page.viewmodel';
import { selectPermission } from 'src/app/auth/auth.selector';
import * as _ from 'lodash';
import { PermissionViewModel } from 'src/app/core/view-models/permission.viewmodel';
import { Permission } from 'src/app/core/constants/permission.const';
import { SUPER_ADMIN_ID } from 'src/app/auth/auth.constants';
@Injectable()
export class AppService {
    private url = 'api/v1/core/apps';
    private _permissions: RolePageViewModel[] = [];
    constructor(
    public store: Store<AppState>,
    private httpClient: HttpClient) {
    this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    get permissions() {
        if (this._permissions) {
            return this._permissions;
        }

        // Get permission from localStorage.
        const permissions = this.store.pipe(select(selectPermission));
        if (permissions) {
            return permissions;
        }
        return [];
    }

    fetchAuthSettings() {
        return this.httpClient.get(`${this.url}`);
    }

    getPermissionByPageId(pageId?: number): PermissionViewModel {
        const superAdmin = _.find(this.permissions, (permission: { roleId: string, type: string, pageId: number }) => {
            return permission.roleId === SUPER_ADMIN_ID;
        });

        if (superAdmin) {
            return {
                view: true,
                add: true,
                edit: true,
                delete: true,
                export: true,
                print: true,
                approve: true,
                report: true
            } as PermissionViewModel;
        }
        
        return {
            view: this.checkPermission(pageId, Permission.view),
            add: this.checkPermission(pageId, Permission.add),
            edit: this.checkPermission(pageId, Permission.edit),
            delete: this.checkPermission(pageId, Permission.delete),
            export: this.checkPermission(pageId, Permission.export),
            print: this.checkPermission(pageId, Permission.print),
            approve: this.checkPermission(pageId, Permission.approve),
            report: this.checkPermission(pageId, Permission.report)
        } as PermissionViewModel;
    }
    
    private checkPermission(pageId: number, permission: number): boolean {
        const permissionInfo = _.find(this.permissions, (permissionItem: { pageId: number, permission: number }) => {
            return permissionItem.pageId === pageId;
        });
        if (!permissionInfo) {
            return false;
        }
        return (permissionInfo.permissions & permission) === permission;
    }
}