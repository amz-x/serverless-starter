

// Constructs
import { Construct } from 'constructs';

// Defaults
import { defaultConfig } from '../config';

// Constants
import { COGNITO_DEFAULTS, STACK_PREFIX } from '../constants';

// AWS Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';

// AWS Cognito User Pool
import { CognitoUserPool } from '@cdktf/provider-aws/lib/cognito-user-pool';
import { CognitoUserPoolClient } from '@cdktf/provider-aws/lib/cognito-user-pool-client';
import { CognitoIdentityPool } from '@cdktf/provider-aws/lib/cognito-identity-pool';

/**
 * AWS - Cognito User Pool
 */
export class ServerlessStarterCognitoUserPool extends Construct {

  public readonly resource: CognitoUserPool;

  constructor(scope: Construct, name = `${STACK_PREFIX}-cognito-user-pool`, provider: AwsProvider) {
    super(scope, name);

    this.resource = new CognitoUserPool(this, name, {
      provider:                       provider,
      name:                           name,
      adminCreateUserConfig:          COGNITO_DEFAULTS.adminCreateUserConfig,
      accountRecoverySetting:         COGNITO_DEFAULTS.accountRecoverySetting,
      autoVerifiedAttributes:         COGNITO_DEFAULTS.autoVerifiedAttributes,
      passwordPolicy:                 COGNITO_DEFAULTS.passwordPolicy,
      mfaConfiguration:               COGNITO_DEFAULTS.mfaConfiguration,
      softwareTokenMfaConfiguration:  COGNITO_DEFAULTS.softwareTokenMfaConfiguration,
      verificationMessageTemplate:    COGNITO_DEFAULTS.verificationMessageTemplate,
      tags:                           defaultConfig.template.cognito.tags
    });
  }
}

/**
 * AWS - Cognito User Pool Client
 */
export class ServerlessStarterCognitoUserPoolClient extends Construct {

  public readonly resource: CognitoUserPoolClient;

  constructor(scope: Construct, name = `${STACK_PREFIX}-cognito-user-pool-client`, provider: AwsProvider, userPool: CognitoUserPool) {
    super(scope, name);

    this.resource = new CognitoUserPoolClient(this, name, {
      provider:                       provider,
      name:                           name,
      userPoolId:                     userPool.id,
      supportedIdentityProviders:     COGNITO_DEFAULTS.supportedIdentityProviders,
      explicitAuthFlows:              ['USER_PASSWORD_AUTH']
      // authSessionValidity:            5, // Minutes
      // accessTokenValidity:            2, // Days
      // idTokenValidity:                2, // Days
      // refreshTokenValidity:           7, // Days
      // tokenValidityUnits:             COGNITO_DEFAULTS.tokenValidityUnits,
    }); 
  }
}

/**
 * AWS - Cognito User Identity Pool
 */
export class ServerlessStarterCognitoUserIdentityPool extends Construct {

  public readonly resource: CognitoIdentityPool;

  constructor(scope: Construct, name = `${STACK_PREFIX}-cognito-user-identity-pool`, provider: AwsProvider, userPool: CognitoUserPool, userPoolClient: CognitoUserPoolClient) {
    super(scope, name);

    this.resource = new CognitoIdentityPool(this, name, {
      provider:                       provider,
      identityPoolName:               name,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [{
        clientId:                     userPoolClient.id,
        providerName:                 userPool.endpoint,
        serverSideTokenCheck:         false
      }]
    }); 
  }
}
