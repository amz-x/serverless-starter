// Terraform CDK
import { App } from 'cdktf';

// Constants
import { ServerlessStarterAPILambdaStack } from './lib/api';
import { ServerlessStarterWebAppStack } from './lib/webapp';

const terraformAppStack = new App();

// API STACK
new ServerlessStarterAPILambdaStack(terraformAppStack, 'serverless-starter-api', {
  path:       '../../api/dist',
  handler:    'lambda.handler',
  runtime:    'nodejs18.x',
  stageName:  'dev',
  version:    'v0.0.38'
});

// WEB APP STACK
new ServerlessStarterWebAppStack(terraformAppStack, 'serverless-starter-webapp', {
  path:       '../../webapp',
  runtime:    'nodejs18.x',
  stageName:  'dev',
  version:    'v0.0.3'
});


terraformAppStack.synth();
