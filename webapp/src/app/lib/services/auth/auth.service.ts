import { Injectable } from '@angular/core';
import { storage } from '@lib/utils/storage/storage.utils';
import { Amplify, Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs';

// AWS Cognito Auth Library
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

// Logger
import { logger } from '@lib/utils';

// Interfaces
import { Exception } from '@lib/interfaces';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /* Auth - User Session */
  private _userSession: CognitoUserSession | null = null;

  /* Auth - JWT Token */
  private _jwtToken: string | null = null;

  /**
   * Auth - Initialize
   */
  private async _initializeAsync(): Promise<void> {
    try {

      // User Session
      const userSession = await Auth.currentSession();

      // Validate User Session
      if (typeof userSession !== 'undefined' && userSession !== null && userSession.isValid()) {
        this._userSession = userSession;

        const payload = userSession.getIdToken().decodePayload();
        const token   = userSession.getIdToken().getJwtToken();

        if (typeof payload['sub'] === 'string' && typeof token === 'string') {
          this.setSession(token);
        }
      }

    } catch(ex: Exception) {
      logger.debug(`[AuthService] - Error: Initialize - [${ex}]`);
    }
  }

  private handleSessionCallback(error: any, result: any): any {
    try {

      console.debug(`TEST`, error, result);

    } catch (ex) {
      logger.debug(`[AuthService] - Error: SessionCallback - [${ex}]`);
    }
  }

  private setSession(token: string): void {
    this._jwtToken = token;
    this.isAuthenticated$.next(true);
  }

  private removeSession(): void {
    this._jwtToken = null;
    this.isAuthenticated$.next(false);
  }

  /**
   * @inheritdoc
   */
  constructor() {
    Auth.wrapRefreshSessionCallback((error, result) => this.handleSessionCallback(error, result))
    this._initializeAsync();
  }

  isAuthenticated$ = new BehaviorSubject<boolean>(this._jwtToken !== null);

  /**
   * Auth - is authenticated?
   */
  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  /**
   * Auth - jwtToken
   */
  get jwtToken(): string {
    return this._jwtToken ?? '';
  }

  /**
   * Auth - Sign In
   *
   * @TODO
   */

  /**
   * Auth - Sign Out
   */
  public async signOut(): Promise<void> {
    try {
      await Auth.signOut();
      this.removeSession();
    } catch (ex: Exception) {
      logger.debug(`[AuthService] - Error: Signing Out - [${ex}]`);
    }
  }
}
