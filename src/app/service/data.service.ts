import { Injectable } from '@angular/core';
import { ApiUrl } from '../config/config';
import { WebService } from './web.service';
import { Observable } from 'rxjs';
import { IModel, IUser } from '../model/data';
import { map } from 'rxjs/operators';
import { IData, IPage } from '../model/base';
import { Md5 } from 'ts-md5';

export interface IFilter {
  key: string;
  val: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = ApiUrl;

  constructor(private webService: WebService) { }

  private setUrl(position: string, filters?: IFilter[], id?: number): string {
    let url = `${this.apiUrl}/${position}`;
    if (!!id) {
      url += `$id`;
    }
    if (!!filters && !!filters.length) {
      url += `?`;
      filters.forEach((item: IFilter, index: number) => {
        if (!!index) {
          url += `&&`;
        }
        url += `${item.key}=${item.val}`;
      });
    }
    return url;
  }

  connect(token: string): Observable<IData> {
    const url = this.setUrl('admins', [
      {key: 'token', val: token},
      {key: '_embed', val: 'holds'}
    ]);
    return this.webService.getF(url).pipe(
      map((res: IModel[]) => {
        let errorCode = 0;
        if (!res || !res.length) {
          errorCode = 2;
        }
        if (!!res[0]) {
          const user = res[0] as IUser;
          if (user.status !== 1) {
            errorCode = 3;
          }
        }
        this.webService.setHeaders(token);
        return {
          res,
          errorCode
        } as IData;
      })
    );
  }

  getData(position: string, id?: number, filters?: IFilter[], pageObj?: IPage): Observable<IData> {
    const url = this.setUrl(position, filters, id);
    return this.webService.getF(url).pipe(
      map((res: IModel[]) => {
        const errorCode = 0;
        if (!!pageObj) {
          pageObj.length = res.length;
          // tslint:disable-next-line: no-string-literal
          res['pageObj'] = pageObj;
          res = this.rangeData(res, pageObj);
        }
        return this.resData(res, errorCode);
      })
    );
  }

  insertOne(position: string, obj: IModel): Observable<IData> {
    const url = this.setUrl(position);
    return this.webService.postF(url, obj).pipe(
      map((res: IModel) => {
        let errorCode = 0;
        if (!res || !res.id) {
          errorCode = 4;
        }
        return this.resData(res, errorCode);
      })
    );
  }

  updateOne(position: string, obj: IModel, id: number): Observable<IData> {
    const url = this.setUrl(position, null, id);
    return this.webService.patchF(url, obj).pipe(
      map((res: IModel) => {
        let errorCode = 0;
        if (!res) {
          errorCode = 5;
        }
        return this.resData(res, errorCode);
      })
    );
  }

  deleteOne(position: string, id: number): Observable<IData> {
    const url = this.setUrl(position, null, id);
    return this.webService.delF(url).pipe(
      map((res: IModel) => {
        let errorCode = 0;
        if (Object.keys(res).length !== 0) {
          errorCode = 6;
        }
        return this.resData(res, errorCode);
      })
    );
  }

  checkData(obj: IModel, operatorId: number, isInsert = true): IModel {
    const insert = {
      insertBy: operatorId,
      inserted: new Date().getTime()
    } as IModel;

    const update = {
      updateBy: operatorId,
      updated: new Date().getTime()
    } as IModel;

    if (isInsert) {
      obj = {...obj, ...insert, ...update};
    } else {
      obj = {...obj, ...update};
    }
    return obj;
  }


  resData(res: IModel[] | IModel, errorCode: number): IData {
    return {
      res,
      errorCode
    };
  }

  rangeData(obj: IModel[], pageObj: IPage): IModel[] {
    const start = pageObj.pageIndex * pageObj.pageSize;
    let end = start + pageObj.pageSize;
    if (pageObj.length < end) {
      end = pageObj.length;
    }
    return obj.slice(start, end);
  }

  makeToken(account: string): string {
    return Md5.hashStr(`${account}`) as string;
    // return 'abcdefghijklmnopqrstuvwxyz';
  }

}
