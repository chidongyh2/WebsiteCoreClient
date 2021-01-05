import { HttpErrorResponse } from "@angular/common/http";
import { BriefUserViewmodel } from "src/app/shareds/view-model/brief-user.viewmodel";
import { RolePageViewModel } from "src/app/shareds/view-model/role-page.viewmodel";
import { MenuItem } from "../interfaces/menu-item.model";
import { ICredentials } from "../models/credentials.model";

export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    tabs?: MenuItem[];
    tabargs?: any;
    menus?: MenuItem[];
    tab?: number;
    permissions?: RolePageViewModel[];
    error?: HttpErrorResponse;
    token?: string;
    currUser?: BriefUserViewmodel,
    credentials?: ICredentials;
}