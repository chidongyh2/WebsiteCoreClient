import { ActionAuthLogout } from './../../auth/auth.actions';
import { AppState } from './../states/core.state';
import { APP_CONFIG, IAppConfig } from '../../configs/app.config';
import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Router } from '@angular/router';
import { catchError, flatMap } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from 'src/app/auth/auth.constants';
import { Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CoreInterceptorService implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
        private toastr: ToastrService,
        private injector: Injector,
        private localStorageService: LocalStorageService,
        private store: Store<AppState>,
        private translate: TranslateService,
        private router: Router) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const contentType = req.headers.get('Content-Type');
        const authService = this.injector.get(AuthService);
        let apiReq: any;
        if (req.headers.get('useAuth') === this.appConfig.USE_AUTH) {
            const token = this.localStorageService.getItem(AUTH_TOKEN);
            apiReq = req.clone({
                headers: new HttpHeaders()
                    .set('Access-Control-Allow-Origin', '*')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'vi-VN')
                    .set('Authorization', `bearer ${token}`)
            });

            if (apiReq.headers.get('Content-Type') === 'clear') {
                apiReq.headers.delete('Content-Type', 'clear');
            }
            return next.handle(apiReq).pipe(
                catchError(response => {
                    if (response instanceof HttpErrorResponse) {
                        if (response.status === 401) {
                            this.store.dispatch(new ActionAuthLogout());
                            return throwError(this.translate.instant('auth.error.cantRefreshToken'));
                        }
                        return this.handlingError(response);
                    }

                    return throwError(this.translate.instant('auth.error.somethingWentWrong'));
                }));
        } else {
            const token = this.localStorageService.getItem(AUTH_TOKEN);
            if (contentType === 'clear') {
                apiReq = req.clone({
                    headers: new HttpHeaders()
                        .set('Access-Control-Allow-Origin', '*')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'vi-VN')
                        .set('Authorization', `bearer ${token}`)
                });
            } else {
                apiReq = req.clone({
                    headers: req.headers.set('Access-Control-Allow-Origin', '*')
                        .set('Content-Type', contentType ? contentType : 'application/json')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'vi-VN')
                        .set('Authorization', `bearer ${token}`)
                });
            }

            if (apiReq.headers.get('Content-Type') === 'clear') {
                apiReq.headers.delete('Content-Type', 'clear');
            }
            
            return next.handle(apiReq).pipe(
                catchError(response => {
                    if (response instanceof HttpErrorResponse) {
                        if (response.status === 401) {
                            const refreshToken = this.localStorageService.getItem(AUTH_REFRESH_TOKEN);
                            return authService
                                .getRefreshToken(refreshToken)
                                .pipe(flatMap(result => {
                                    if (result) {
                                        const reqRefreshAuth = apiReq.clone({
                                            headers: req.headers.set('Authorization', `bearer ${result}`)
                                        });
                                        return next.handle(reqRefreshAuth)
                                            .pipe(catchError(refreshTokenResponse => {
                                                if (refreshTokenResponse instanceof HttpErrorResponse) {
                                                    this.handlingError(refreshTokenResponse);
                                                }
                                                this.store.dispatch(new ActionAuthLogout());
                                                return of(null);
                                            }));
                                    } else {
                                        this.store.dispatch(new ActionAuthLogout());
                                        return throwError(this.translate.instant('auth.error.cantRefreshToken'));
                                    }
                                }), catchError((errorResponse: HttpErrorResponse) => {
                                    this.handlingError(errorResponse);
                                    return throwError(this.translate.instant('auth.error.cantRefreshToken'));
                                }));
                        }
                        return this.handlingError(response);
                    }

                    return throwError(this.translate.instant('auth.error.somethingWentWrong'));
                }));
        }
    }

    private handlingError(response: HttpErrorResponse): Observable<HttpErrorResponse> {
        switch (response.status) {
            case 403:
                this.router.navigate(['/error/permission']);
                break;
            case 400:
                try {
                    const error = response.error;
                    if (error.code != null && typeof error.code !== 'undefined') {
                        this.toastr.error(error.message, error.title);
                        return throwError(error);
                    } else if (error.error) {
                        if (error.error === 'invalid_client') {
                            this.store.dispatch(new ActionAuthLogout());
                            this.toastr.error(this.translate.instant('auth.error.invalidClient'));
                        } else if (error.error === 'invalid_grant') {
                            this.store.dispatch(new ActionAuthLogout());
                        } else if (error.error_description && error.error_description !== 'account_does_not_exists') {
                            this.store.dispatch(new ActionAuthLogout());
                            this.toastr.error(error.error_description);
                        } else if (error.error_description === 'account_does_not_exists') {
                            this.toastr.error(this.translate.instant('auth.error.accountDoesNotExists'));
                        }
                    } else {
                        for (const key in error) {
                            if (error.hasOwnProperty(key)) {
                                const values = error[key];
                                values.forEach((value) => {
                                    this.toastr.error(value);
                                });
                            }
                        }
                    }
                } catch (ex) {
                    // this.toastr.warning('Có gì đó hoạt động chưa đúng. Vui lòng liên hệ với quản trị viên.', 'Thông báo');
                    return throwError(response);
                }
                break;
            case 404:
                // if (response.status === 404) {
                //     this.router.navigate(['/error/not-found']);
                // }
                break;
            case 500:
                this.toastr.error(this.translate.instant('auth.error.somethingWentWrong'));
                break;
        }
        return throwError(response);
    }

}