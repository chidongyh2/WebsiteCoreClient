import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { APP_CONFIG, IAppConfig } from "src/app/configs/app.config";
import { environment } from "src/environments/environment";
 
@Injectable({ providedIn: 'root' })
export class AuthService {

    authMessage$ = new Subject<string>();

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
    }

    login(userName: string, password: string) {
        const body = `grant_type=password&username=${userName}&password=${password}
            &client_id=${this.appConfig.CLIENT_ID}&scope=${this.appConfig.SCOPES}&client_secret=${this.appConfig.CLIEN_SECRET}`;
        return this.http.post(`${environment.apiGatewayUrl}auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
    }

    getRefreshToken(refreshToken) {
        const body = `grant_type=refresh_token&client_id=${this.appConfig.CLIENT_ID}&refresh_token=${refreshToken}
        &client_secret=${this.appConfig.CLIEN_SECRET}`;
        return this.http.post(`${environment.apiGatewayUrl}auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).pipe(map((result: any) => {
            return result.refresh_token;
        })) as Observable<string>;
    }
}