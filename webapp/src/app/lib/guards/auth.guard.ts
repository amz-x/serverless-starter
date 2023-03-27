import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { APP_ROUTES } from '@lib/constants/app.routes';
import { AuthService } from '@lib/services';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private _router: Router, private _authService: AuthService) {}

  private _isAuthenticated(segments?: UrlSegment[]): boolean {
    const isAuthenticated = this._authService.isAuthenticated;
    if (isAuthenticated) {
      return true;
    }

    const options = { queryParams: {} };
    if (segments) {
      options.queryParams = { callbackURL: segments.map((s) => s.path).join('/') };
    }

    this._router.navigate([APP_ROUTES.INDEX.url], options);
    return false;
  }

  public canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this._isAuthenticated(segments);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._isAuthenticated();
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._isAuthenticated();
  }
}
