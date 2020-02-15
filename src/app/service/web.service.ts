import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  setHeaders(token: string) {
    this.headers = new HttpHeaders().set('Authentication', token);
  }

  getF<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url, {headers: this.headers}).pipe(
      tap(res => this.logger.print('http get', res)),
      catchError(this.handleError)
    );
  }

  postF<T>(url: string, obj: T): Observable<T> {
    return this.http.post<T>(url, obj, {headers: this.headers} ).pipe(
      tap(res => this.logger.print('http post', res)),
      catchError(this.handleError)
    );
  }

  delF<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: this.headers }).pipe(
      tap(res => this.logger.print('http del', res)),
      catchError(this.handleError)
    );
  }

  putF<T>(url: string, obj: T): Observable<T> {
    return this.http.put<T>(url, obj, { headers: this.headers }).pipe(
      tap(res => this.logger.print('http put', res)),
      catchError(this.handleError)
    );
  }

  patchF<T>(url: string, obj: T): Observable<T> {
    return this.http.patch<T>(url, obj, { headers: this.headers}).pipe(
      tap(res => this.logger.print('http patch', res)),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response | any): Observable<any> {
    console.error(`${error.status}`);
    return of(null);
  }

}
