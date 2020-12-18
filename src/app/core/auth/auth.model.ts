import { MenuItem } from "../interfaces/menu-item.model";
import { ICredentials } from "../models/credentials.model";

export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    tabs?: MenuItem[];
    menu?: MenuItem[];
    tab?: string;
    permission?: any;
    avatar: string;
    logo?: string;
    error?: any;
    credentials?: ICredentials;
}