// Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { S3Bucket } from '@cdktf/provider-aws/lib/s3-bucket';

// TF - Constructs
import { Construct } from 'constructs';

// Constants
import { STACK_PREFIX } from '../constants';

// Config
import { defaultConfig } from '../config';

/**
 * Serverless - API Lambda Bucket
 */
export class ServerlessStarterDeployBucket extends Construct {

  public readonly resource: S3Bucket;

  constructor(scope: Construct, name = `${STACK_PREFIX}-deploy-bucket`, provider: AwsProvider) {
    super(scope, name);

    // Create unique S3 bucket that hosts lambda archives
    this.resource = new S3Bucket(this, name, {
      provider: provider,
      bucket:   defaultConfig.template.api.bucket.domain,
      tags:     defaultConfig.template.api.bucket.tags
    });
  }
}

/**
 * Serverless - Terraform State Bucket
 */
export class ServerlessStarterTerraformStateBucket extends Construct {

  public readonly resource: S3Bucket;

  constructor(scope: Construct, name = `${STACK_PREFIX}-terraform-state-bucket`, provider: AwsProvider) {
    super(scope, name);

    // Create unique S3 bucket that hosts lambda archives
    this.resource = new S3Bucket(this, name, {
      provider: provider,
      bucket:   defaultConfig.template.terraform.bucket.domain,
      tags:     defaultConfig.template.terraform.bucket.tags
    });
  }
}

/**
 * Serverless - Web App Bucket
 */
export class ServerlessStarterWebAppBucket extends Construct {

  public readonly resource: S3Bucket;

  constructor(scope: Construct, name = `${STACK_PREFIX}-webapp-bucket`) {
    super(scope, name);

    // Create unique S3 bucket that hosts web app assets
    this.resource = new S3Bucket(this, name, {
      bucket: defaultConfig.template.webapp.domain,
      tags:   defaultConfig.template.webapp.bucket.tags
    });
  }
}
