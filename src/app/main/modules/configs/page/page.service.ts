import { SearchResultViewModel } from 'src/app/core/view-models/search-result.viewmodel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from 'src/app/configs/app.config';
import { ISearchResult } from 'src/app/core/view-models/isearch.result';
import { environment } from 'src/environments/environment';
import { PageSearchViewModel } from './models/page-search.viewmodel';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class PageService {
  url = 'api/v1/core/pages';
  constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
    private http: HttpClient) {
    this.url = `${environment.apiGatewayUrl}${this.url}`;
  }

  search(keyword: string = '', sort: string = '', isActive?: boolean): Observable<SearchResultViewModel<PageSearchViewModel>> {
    return this.http.get(`${this.url}`, {
      params: new HttpParams()
        .set('keyword', keyword)
        .set('sort', sort)
        .set('isActive', isActive != null ? isActive.toString() : '')
    }).pipe(map((result: ISearchResult<PageSearchViewModel>) => {
      if (result.items) {
        _.each(result.items, (page: PageSearchViewModel) => {
          const idPathArray = page.idPath.split('.');
          page.namePrefix = '';
          for (let i = 1; i < idPathArray.length; i++) {
            page.namePrefix += '<i class="fa fa-long-arrow-right cm-mgr-5"></i>';
          }
        });
      }
      return result;
    })) as Observable<SearchResultViewModel<PageSearchViewModel>>;
  }
}
