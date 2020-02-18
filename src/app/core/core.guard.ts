import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { AppService } from '../app.service';
import { LoginService } from '../service/login.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreGuard implements CanActivate {
  constructor(
    private router: Router,
    private service: AppService,
    private loginService: LoginService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
      // return true;
      return this.loginService.loginState.pipe(
        map(e => {
          console.log('CoreGuard', e);
          console.log(next);
          console.log(state);
          if (e) { return true; }
        }),
        catchError(e => {
          console.log('CoreGuard', e);
          this.service.backLogin();
          // tslint:disable-next-line: deprecation
          return Observable.throw(e);
        })
      );
  }
}
