// Stack Prefix
export const STACK_PREFIX = 'serverless-starter';

// S3 Origin ID
export const S3_ORIGIN_ID = 's3Origin';

// Cognito Defaults
export const COGNITO_DEFAULTS = Object.freeze({
  /* --- USER POOL CONFIG --- */ 

  // Account Recovery Setting
  accountRecoverySetting: {
    recoveryMechanism: [
      {
        name:                     'verified_email',
        priority:                 1
      }
    ]
  },
  // MFA Configuration
  mfaConfiguration:               'ON',
  softwareTokenMfaConfiguration:  { enabled: true },
  // Password Policy
  passwordPolicy: {
    minimumLength:                 10,
    requireNumbers:                true,
    requireSymbols:                true,
    requireLowercase:              true,
    requireUppercase:              true,
    temporaryPasswordValidityDays: 1
  },
  // Admin Create User Config
  adminCreateUserConfig: {
    allowAdminCreateUserOnly:     true,
    // Invite Message Template
    inviteMessageTemplate: {
      emailSubject:               'Serverless Starter - Account Invite',
      emailMessage:               'You have been invited! Username: \"{username}\" | Temporary Password: \"{####}\".',
      smsMessage:                 'You have been invited! Username: \"{username}\" | Temporary Password: \"{####}\".'
    },
  },
  // Auto Verified Attributes
  autoVerifiedAttributes:         ['email'],
  // Verification Message Template
  verificationMessageTemplate: {
    defaultEmailOption:            'CONFIRM_WITH_CODE',
    emailSubject:                  'Serverless Starter - Confirm Your Account',
    emailMessage:                  'Your account verification code is: \"{####}\".'
  },
  /* --- USER POOL CLIENT CONFIG --- */
  supportedIdentityProviders:      ['COGNITO'],
  // tokenValidityUnits: {
  //   accessToken:                    'days',
  //   idToken:                        'days',
  //   refreshToken:                   'days'
  // }
})


// Cloudfront Defaults
export const CF_DEFAULTS = Object.freeze({
  // Defaults
  defaultRootObject:               'index.html',
  // Default Cache Behaviour
  defaultCacheBehavior: {
    allowedMethods:                [ 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT' ],
    cachedMethods:                 [ 'GET', 'HEAD' ],
    compress:                      true,
    targetOriginId:                S3_ORIGIN_ID,
    forwardedValues:               { queryString: false, cookies: { forward: 'none' } },
    viewerProtocolPolicy:          'redirect-to-https',
    defaultTtl:                    3600,
    maxTtl:                        86400,
    minTtl:                        3600          
  },
  // Custom Origin Configuration
  customOriginConfig: {
    originProtocolPolicy:          'http-only',
    httpPort:                      80,
    httpsPort:                     443,
    originSslProtocols:            [ 'SSLv3', 'TLSv1.2', 'TLSv1.1', 'TLSv1' ]
  }
});

export const RDS_DEFAULTS = Object.freeze({
  cluster: {
    engine:                        'aurora-postgresql',
    engineVersion:                 '14.6',
    networkType:                   'IPV4',
    backupRetentionPeriod:         1, // 1 Day
    preferredBackupWindow:         '00:00-03:00',
    preferredMaintenanceWindow:    'Mon:03:00-Mon:06:00',
    allowMajorVersionUpgrade:      true,
    copyTagsToSnapshot:            true
  },
  database: {
    instanceClass:                 'db.serverless',
    preferredMaintenanceWindow:    'Mon:03:00-Mon:06:00',
    autoMinorVersionUpgrade:       true,
    copyTagsToSnapshot:            true
  },
  proxy: {
    engineFamily:                  'POSTGRESQL',
    idleClientTimeout:             1800, // 30 mins
    requireTls:                    true, // TLS (SSL) required
    auth:                          { authScheme: 'SECRETS', iamAuth: 'DISABLED', description: 'DEFAULT_PROXY_AUTH' },
    connectionPoolConfig:          { connectionBorrowTimeout: 120, maxConnectionsPercent: 100, maxIdleConnectionsPercent: 50, sessionPinningFilters: [] }
  }
});

