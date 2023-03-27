import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@lib/services';

// Constants
import { APP_ROUTES } from '@lib/constants/app.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private _router: Router, private _authService: AuthService) {}

  private _isAuthenticated(): boolean {
    const isAuthenticated = this._authService.isAuthenticated;
    if (isAuthenticated) {
      this._router.navigate([APP_ROUTES.ADMIN_HOME.url]);
      return false;
    }

    return true;
  }

  public canLoad(): boolean {
    return this._isAuthenticated();
  }

  public canActivate () : boolean {
    return this._isAuthenticated();
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._isAuthenticated();
  }
}
