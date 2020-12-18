import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { APP_CONFIG, IAppConfig } from "src/app/configs/app.config";
 
@Injectable({ providedIn: 'root' })
export class AuthService implements Resolve<any> {
    private user = null;
    private _token: string;
    private _refreshToken: string;
    private _isLoggedIn: boolean;

    authMessage$ = new Subject<string>();

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private router: Router,
                private toastr: ToastrService,
                private http: HttpClient) {
    }
    resolve() {
        if (this.isLoggedIn) {
            this.router.navigateByUrl('/');
            return true;
        }
    }
    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    set isLoggedIn(val: boolean) {
        this._isLoggedIn = val;
    }

    login(userName: string, password: string) {
        if (this.isLoggedIn) {
        }
        const body = `grant_type=password&userName=${userName}&password=${password}
            &client_id=${this.appConfig.CLIENT_ID}&scope=${this.appConfig.SCOPES}`;
        return this.http.post(`auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
    }

    getRefreshToken(refreshToken) {
        const body = `grant_type=refresh_token&client_id=${this.appConfig.CLIENT_ID}&refresh_token=${refreshToken}`;
        return this.http.post(`auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).pipe(map((result: any) => {
            // if (result) {
            //     this.token = result.access_token;
            //     this.refreshToken = result.refresh_token;
            //     this.isLoggedIn = true;
            //     return this.token;
            // }
            return result.refresh_token;
        })) as Observable<string>;
    }
}