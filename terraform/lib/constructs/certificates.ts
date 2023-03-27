// TF - Constructs
import { AcmCertificate } from '@cdktf/provider-aws/lib/acm-certificate';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Construct } from 'constructs';


// Constants
import { STACK_PREFIX } from '../constants';

// Configuration
import { defaultConfig } from '../config';

/**
 * Serverless - API SSL Certificate
 */
export class ServerlessStarterApiCertificate extends Construct {

  public readonly resource: AcmCertificate;

  constructor(scope: Construct, name = `${STACK_PREFIX}-api-ssl-certificate`, provider: AwsProvider) {
    super(scope, name);

    this.resource = new AcmCertificate(this, name, {
      provider:                 provider,
      domainName:               defaultConfig.template.api.domain,
      validationMethod:         'DNS',
      validationOption: [{
        domainName:             defaultConfig.template.api.domain,
        validationDomain:       defaultConfig.root_domain_name
      }],
      tags:                     defaultConfig.template.api.certificate.tags
    }); 
  }
}

/**
 * Serverless - Web App SSL Certificate
 */
export class ServerlessStarterAppCertificate extends Construct {

  public readonly resource: AcmCertificate;

  constructor(scope: Construct, name = `${STACK_PREFIX}-webapp-ssl-certificate`, provider: AwsProvider) {
    super(scope, name);

    this.resource = new AcmCertificate(this, name, {
      provider:                 provider,
      domainName:               defaultConfig.template.webapp.domain,
      validationMethod:         'DNS',
      validationOption: [{
        domainName:             defaultConfig.template.webapp.domain,
        validationDomain:       defaultConfig.root_domain_name
      }],
      tags:                     defaultConfig.template.webapp.certificate.tags
    }); 
  }
}
