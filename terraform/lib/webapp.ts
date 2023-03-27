
// Terraform CDK
import { TerraformOutput, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

// Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { S3BucketWebsiteConfiguration } from '@cdktf/provider-aws/lib/s3-bucket-website-configuration';
import { S3BucketPolicy } from '@cdktf/provider-aws/lib/s3-bucket-policy';
import { CloudfrontDistribution } from '@cdktf/provider-aws/lib/cloudfront-distribution';

// Interfaces
import { ServerlessWebAppConfigProps } from './interfaces';

// Constants
import { STACK_PREFIX, S3_ORIGIN_ID, CF_DEFAULTS } from './constants';

// Constructs - Shared
import { ServerlessStarterWebAppBucket } from './constructs/buckets';

// Config
import { defaultConfig } from './config';
import { ServerlessStarterAppCertificate } from './constructs/certificates';
import { ServerlessStarterDeployWebAppHelper } from './constructs/helpers';
import { ServerlessStarterAppDomainNameRecord } from './constructs/domains';

/**
 * Serverless Starter - WebApp + S3 + Cloudfront
 */
export class ServerlessStarterWebAppStack extends TerraformStack {

  public readonly provider:  AwsProvider;

  constructor(scope: Construct, name = `${STACK_PREFIX}-webapp`, props: ServerlessWebAppConfigProps) {
    super(scope, name);

    // AWS Provider WebApp
    this.provider = new AwsProvider(this, `aws-${defaultConfig.template.api.provider.alias}`, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.api.provider.region,
      alias:    defaultConfig.template.api.provider.alias,
    });

    // WebApp Bucket
    const webAppBucket = new ServerlessStarterWebAppBucket(this);  

    // WebApp Bucket - Website
    const webAppWebsiteBucket = new S3BucketWebsiteConfiguration(this, `${name}-website-config`, {
      provider:          this.provider,
      bucket:            webAppBucket.resource.bucket,
      indexDocument: {
        suffix:         'index.html'
      },
      errorDocument: {
        key:            'index.html'
      }
    });

    // Build & Upload Assets
    new ServerlessStarterDeployWebAppHelper(this, `${name}-deploy-app-helper`, { path: props.path });

    // Policy
    new S3BucketPolicy(this, `${name}-s3-policy`, {
      bucket: webAppBucket.resource.id,
      policy: JSON.stringify({
        Version:        '2012-10-17',
        Id:             'PolicyForWebsiteEndpointsPublicContent',
        Statement: [
          {
            Sid:        'PublicRead',
            Effect:     'Allow',
            Principal:  '*',
            Action:     [ 's3:GetObject' ],
            Resource:   [ `${webAppBucket.resource.arn}/*`, `${webAppBucket.resource.arn}` ]
          }
        ]
      })
    });

    // US Region Provider
    const usRegionProvider = new AwsProvider(this, `aws-north-virginia`, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.webapp.certificate.region,
      alias:    'north-virginia',
    });

    // Cloudfront SSL Certificate
    const webAppCertificate = new ServerlessStarterAppCertificate(this, undefined, usRegionProvider); 

    // Cloudfront
    const webAppCloudfrontDistribution = new CloudfrontDistribution(this, `${name}-cloudfront-distribution`, {
      provider:                 this.provider,
      enabled:                  true,
      priceClass:               defaultConfig.template.webapp.cloudfront.price_class,
      aliases:                  [ defaultConfig.template.webapp.domain ],
      origin: [{
        originId:               S3_ORIGIN_ID,
        domainName:             webAppWebsiteBucket.websiteEndpoint,
        customOriginConfig:     CF_DEFAULTS.customOriginConfig,
      }],
      defaultRootObject:        CF_DEFAULTS.defaultRootObject,
      defaultCacheBehavior:     CF_DEFAULTS.defaultCacheBehavior,
      restrictions:             { geoRestriction: { restrictionType: 'none' } },
      viewerCertificate:        { acmCertificateArn: webAppCertificate.resource.arn, sslSupportMethod: 'sni-only' }
    });

    new ServerlessStarterAppDomainNameRecord(this, `${name}-webapp-domain-record`, {
      name:                     webAppCloudfrontDistribution.domainName,
      zoneId:                   webAppCloudfrontDistribution.hostedZoneId,
      evaluateTargetHealth:     false
    });

    new TerraformOutput(this, 'webapp_url', {
      value: webAppCloudfrontDistribution.domainName
    }).addOverride('value', `https://${webAppCloudfrontDistribution.domainName}`);
  }
}
