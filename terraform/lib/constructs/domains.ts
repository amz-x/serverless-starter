// TF - Constructs
import { Route53Record, Route53RecordAlias } from '@cdktf/provider-aws/lib/route53-record';
import { Construct } from 'constructs';
import { defaultConfig } from '../config';

// Constants
import { STACK_PREFIX } from '../constants';



export class ServerlessStarterApiDomainNameRecord extends Construct {

  public readonly resource: Route53Record;

  constructor(scope: Construct, name = `${STACK_PREFIX}-api-domain-name-record`, alias: Route53RecordAlias) {
    super(scope, name);

    this.resource = new Route53Record(this, name, {
      zoneId:         defaultConfig.zone_id,
      name:           defaultConfig.template.api.domain,
      type:           'A',
      allowOverwrite: true,
      alias:          alias
    });
  }
}

export class ServerlessStarterAppDomainNameRecord extends Construct {

  public readonly resource: Route53Record;

  constructor(scope: Construct, name = `${STACK_PREFIX}-webapp-domain-name-record`, alias: Route53RecordAlias) {
    super(scope, name);

    this.resource = new Route53Record(this, name, {
      zoneId:         defaultConfig.zone_id,
      name:           defaultConfig.template.webapp.domain,
      type:           'A',
      allowOverwrite: true,
      alias:          alias
    }); 
  }
}
