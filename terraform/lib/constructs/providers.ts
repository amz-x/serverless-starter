import { AwsProvider }    from '@cdktf/provider-aws/lib/provider';
import { Construct }      from 'constructs';

// Configuration
import { defaultConfig }  from '../config';

export class ServerlessStarterAwsProviderRegional extends Construct {

  public readonly resource: AwsProvider;

  constructor(scope: Construct, name = `aws-provider-api-region-${defaultConfig.template.api.provider.alias}`) {
    super(scope, name);

    this.resource = new AwsProvider(this, name, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.api.provider.region,
      alias:    defaultConfig.template.api.provider.alias,
    });
  }
}

export class ServerlessStarterAwsProviderCognito extends Construct {

  public readonly resource: AwsProvider;

  constructor(scope: Construct, name = `aws-provider-cognito-region-${defaultConfig.template.cognito.provider.alias}`) {
    super(scope, name);

    this.resource = new AwsProvider(this, name, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.cognito.provider.region,
      alias:    defaultConfig.template.cognito.provider.alias,
    });
  }
}
