// Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { SecretsmanagerSecret } from '@cdktf/provider-aws/lib/secretsmanager-secret';

// TF - Constructs
import { Construct } from 'constructs';

// Constants
import { STACK_PREFIX } from '../constants';


export class ServerlessStarterSecretsmanagerSecret extends Construct {

  // AWS Secrets Manager
  public readonly resource: SecretsmanagerSecret;

  constructor(scope: Construct, name = `${STACK_PREFIX}-db-credentials`, provider: AwsProvider) {
    super(scope, name);
    
    this.resource = new SecretsmanagerSecret(this, `${name}-identifier`, {
      provider: provider,
      name:     name   
    });
  }
}
