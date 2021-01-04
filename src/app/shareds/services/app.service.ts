import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/states/core.state';
import { environment } from "src/environments/environment";

@Injectable()
export class AppService {
    private url = 'api/v1/core/apps';
    constructor(
    public store: Store<AppState>,
    private httpClient: HttpClient) {
    this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    fetchAuthSettings() {
        return this.httpClient.get(`${this.url}`);
    }
}