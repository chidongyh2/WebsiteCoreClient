import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/local-storage/local-storage.service';
import { Credentials } from 'src/app/core/models/credentials.model';
import { AppState } from 'src/app/core/states/core.state';
import { ActionAuthenticate } from '../auth.actions';
import { AUTH_REMEMBER } from '../auth.constants';
import { selectError, selectIsAuthenticated } from '../auth.selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials: Credentials;
  isAuthenticated$: Observable<boolean>;
  error$: Observable<HttpErrorResponse>;
  err;
  @ViewChild('loginForm') loginForm;

  constructor(
    public store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.credentials = new Credentials();
    const tempRemember = this.localStorageService.getItem(AUTH_REMEMBER);
    this.credentials = Object.assign({}, tempRemember);
    // this.credentials.password = tempRemember.password;
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.error$ = this.store.pipe(select(selectError));
      this.store.pipe(select(selectError)).subscribe(err => {
        this.err = err;
      });
      this.store.pipe(select(selectError)).subscribe(err => { console.log(err); });
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
  }

  login = () => {
    if (this.loginForm.valid) {
        this.store.dispatch(new ActionAuthenticate({ credentials: Object.assign({}, this.credentials),
          returnUrl: this.route.snapshot.queryParamMap.get('returnUrl')}));
    }
  }
}
