// Nodejs Path
import * as path from 'path';

// Terraform CDK
import { AssetType, TerraformAsset, TerraformOutput, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';

// Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Apigatewayv2Api } from '@cdktf/provider-aws/lib/apigatewayv2-api';
import { Apigatewayv2Authorizer } from '@cdktf/provider-aws/lib/apigatewayv2-authorizer';
import { Apigatewayv2Integration } from '@cdktf/provider-aws/lib/apigatewayv2-integration';
import { Apigatewayv2Route } from '@cdktf/provider-aws/lib/apigatewayv2-route';
import { Apigatewayv2DomainName } from '@cdktf/provider-aws/lib/apigatewayv2-domain-name';
import { Apigatewayv2ApiMapping } from '@cdktf/provider-aws/lib/apigatewayv2-api-mapping';
import { Apigatewayv2Stage } from '@cdktf/provider-aws/lib/apigatewayv2-stage';
import { S3Object } from '@cdktf/provider-aws/lib/s3-object';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamRolePolicyAttachment } from '@cdktf/provider-aws/lib/iam-role-policy-attachment';
import { LambdaFunction } from '@cdktf/provider-aws/lib/lambda-function';
import { LambdaPermission } from '@cdktf/provider-aws/lib/lambda-permission';
import { SecretsmanagerSecretVersion } from '@cdktf/provider-aws/lib/secretsmanager-secret-version';
import { InternetGateway } from '@cdktf/provider-aws/lib/internet-gateway';
import { NatGateway } from '@cdktf/provider-aws/lib/nat-gateway';
import { RouteTable } from '@cdktf/provider-aws/lib/route-table';
import { RouteTableAssociation } from '@cdktf/provider-aws/lib/route-table-association';
import { Route } from '@cdktf/provider-aws/lib/route';

// Interfaces
import { ServerlessAPILambdaFunctionConfigProps } from './interfaces';

// Constants
import { STACK_PREFIX } from './constants';

// Constructs
import { ServerlessStarterDeployBucket, ServerlessStarterTerraformStateBucket } from './constructs/buckets';
import { ServerlessStarterCognitoUserIdentityPool, ServerlessStarterCognitoUserPool } from './constructs/cognito';
import { ServerlessStarterCognitoUserPoolClient } from './constructs/cognito';
import { ServerlessStarterApiCertificate } from './constructs/certificates';
import { ServerlessStarterApiDomainNameRecord } from './constructs/domains';
import { ServerlessStarterVPC, ServerlessStarterVPCPrivateSubnets, ServerlessStarterVPCPublicSubnets } from './constructs/vpc';
import { ServerlessStarterRdsDbInstance } from './constructs/db';
import { ServerlessStarterSecretsmanagerSecret } from './constructs/secrets';

// Utils
import { getTimestampPath } from './utils/date';

// Config
import { defaultConfig } from './config';

/**
 * Serverless Starter - Domain Name + SSL + API Gateway + Proxy + Lambda
 */
export class ServerlessStarterAPILambdaStack extends TerraformStack {

  public readonly provider:  AwsProvider;

  constructor(scope: Construct, name = `${STACK_PREFIX}-api`, props: ServerlessAPILambdaFunctionConfigProps) {
    super(scope, name);

    // AWS Provider API
    this.provider = new AwsProvider(this, `aws-${defaultConfig.template.api.provider.alias}`, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.api.provider.region,
      alias:    defaultConfig.template.api.provider.alias,
    });

    // Unique S3 bucket that hosts Terraform IAC assets
    const tfStateBucket = new ServerlessStarterTerraformStateBucket(this, `${name}-tf-state-bucket`, this.provider);

    // Unique S3 bucket that hosts Serverless API assets
    const deployBucket = new ServerlessStarterDeployBucket(this, `${name}-deploy-bucket`, this.provider);

    // Secrets 
    const secret = new ServerlessStarterSecretsmanagerSecret(this, undefined, this.provider);

    // VPC
    const vpc = new ServerlessStarterVPC(this, undefined, this.provider);

    // VPC Subnets - Public
    const vpcPublicSubnets = new ServerlessStarterVPCPublicSubnets(this, undefined, this.provider, vpc.resource);

    // VPC Subnets - Private
    const vpcPrivateSubnets = new ServerlessStarterVPCPrivateSubnets(this, undefined, this.provider, vpc.resource);

    // VPC - Internet Gateway
    const internetGateway = new InternetGateway(this, `${name}-vpc-internet-gw`, {
      vpcId:    vpc.resource.id,
      tags:     defaultConfig.template.vpc.tags
    });

    // VPC - NAT Gateway
    const natGateway = new NatGateway(this, `${name}-vpc-internet-nat-gw`, {
      provider:         this.provider,
      connectivityType: 'private',
      subnetId:         vpcPublicSubnets.resource[0].id
    });

    // VPC - Route Table - Public
    const routeTablePublic = new RouteTable(this, `${name}-vpc-route-table-public`, {
      vpcId:   vpc.resource.id,
    });

    // VPC - Route Table - Public - Subnets
    for (const publicSubnet of vpcPublicSubnets.resource) {
      new RouteTableAssociation(this, `${name}-vpc-route-subnet-public-${(vpcPublicSubnets.resource.indexOf(publicSubnet) + 1)}`, {
        routeTableId: routeTablePublic.id,
        subnetId:     publicSubnet.id
      });
    }

    // VPC - Route Table - Public - Internet Gateway
    new Route(this, `${name}-vpc-route-internet-gw`, {
      routeTableId:         routeTablePublic.id,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId:            internetGateway.id,
    });

    // VPC - Route Table - Private Subnet Group
    const routeTablePrivate = new RouteTable(this, `${name}-vpc-route-table-private`, {
      vpcId:   vpc.resource.id,
    });

    // VPC - Route Table - Private - Subnets
    for (const privateSubnet of vpcPrivateSubnets.resource) {
      new RouteTableAssociation(this, `${name}-vpc-route-subnet-private-${(vpcPrivateSubnets.resource.indexOf(privateSubnet) + 1)}`, {
        routeTableId: routeTablePrivate.id,
        subnetId:     privateSubnet.id
      });
    }

    // VPC - Route Table - Private - NAT Gateway / ENI
    new Route(this, `${name}-vpc-route-nat-gw`, {
      routeTableId:         routeTablePrivate.id,
      destinationCidrBlock: '0.0.0.0/0',
      natGatewayId:         natGateway.id
    });

    // RDS DB Instance
    const rdsDbInstance = new ServerlessStarterRdsDbInstance(this, undefined, this.provider, vpc.resource, vpcPrivateSubnets.resource);

    // RDS DB Credentials Secret
    const rdsDbCredentialsSecret = new SecretsmanagerSecretVersion(this, `${name}-db-credentials`, {
      secretId:     secret.resource.id,
      secretString: JSON.stringify({
        DB_HOST:  rdsDbInstance.resource.endpoint,
        DB_NAME:  defaultConfig.template.db.name,
        DB_USER:  defaultConfig.template.db.username,
        DB_PASS:  defaultConfig.template.db.password,
        DB_PORT:  defaultConfig.template.db.port
      })
    });

    // Create Lambda executable
    const apiAsset = new TerraformAsset(this, `${name}-lambda-asset`, {
      path: path.resolve(__dirname, props.path),        
      type: AssetType.ARCHIVE, // if left empty it infers directory and file
    });

    // Upload Lambda zip file to API deployment S3 bucket
    const lambdaArchive = new S3Object(this, `${name}-lambda-archive-${props.version}`, {
      provider:                     this.provider,
      bucket:                       deployBucket.resource.bucket,
      serverSideEncryption:         'AES256',
      key:                          `serverless/lambda-api-${props.version}/${getTimestampPath()}-${apiAsset.fileName}`,
      source:                       apiAsset.path, // returns a posix path
    });

    // Create Lambda role
    const role = new IamRole(this, `${name}-lambda-role`, {
      name: `${STACK_PREFIX}-role`,
      assumeRolePolicy: JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Sid": "",
            "Principal": {
              "Service": "lambda.amazonaws.com"
            }
          }
        ]
      })
    });

    // Add execution role for lambda to write to CloudWatch logs
    new IamRolePolicyAttachment(this, `${name}-lambda-basic-managed-policy`, {
      policyArn:  'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      role:       role.name
    });

    // Add VPC Access execution role
    new IamRolePolicyAttachment(this, `${name}-lambda-vpc-managed-policy`, {
      policyArn:  'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
      role:       role.name
    });

    // Create Lambda function
    const lambdaFunc = new LambdaFunction(this, `${name}-lambda`, {
      functionName:       `${name}-lambda-main`,
      s3Bucket:           deployBucket.resource.bucket,
      s3Key:              lambdaArchive.key,
      handler:            props.handler,
      runtime:            props.runtime,
      role:               role.arn,
      timeout:            defaultConfig.template.api.lambda.timeout,
      memorySize:         defaultConfig.template.api.lambda.memory,
      vpcConfig: {
        securityGroupIds: [ vpc.resource.defaultSecurityGroupId ],
        subnetIds:        [ ...vpcPrivateSubnets.resource.map(subnet => subnet.id) ],
      },
      environment: {
        variables: {
          NEST_DEBUG:          '*',
          NODE_ENV:            'production',
          API_DATABASE_HOST:   rdsDbInstance.resource.endpoint,
          API_DATABASE_USER:   defaultConfig.template.db.username,
          API_DATABASE_PASS:   defaultConfig.template.db.password, 
          API_DATABASE_NAME:   defaultConfig.template.db.name,
          API_DATABASE_PORT:   `${defaultConfig.template.db.port}`,
        }
      }
    });

    // Cognito Region Provider
    const providerCognito = new AwsProvider(this, `aws-${defaultConfig.template.cognito.provider.alias}`, {
      profile:  defaultConfig.profile,
      region:   defaultConfig.template.cognito.provider.region,
      alias:    defaultConfig.template.cognito.provider.alias,
    });

    // Cognito User Pool
    const userPool = new ServerlessStarterCognitoUserPool(this, undefined, providerCognito);

    // Cognito User Pool Client
    const userPoolClient = new ServerlessStarterCognitoUserPoolClient(this, undefined, providerCognito, userPool.resource);

    // Cognito User Identity Pool
    const userPoolIdentity = new ServerlessStarterCognitoUserIdentityPool(this, undefined, providerCognito, userPool.resource, userPoolClient.resource);

    // Create and configure API gateway
    const api = new Apigatewayv2Api(this, `${name}-gateway`, {
      provider:                   this.provider,
      name:                       name,
      protocolType:               'HTTP',
      target:                     lambdaFunc.arn,
      disableExecuteApiEndpoint:  false
    });

    // API Authorizer
    const apiAuthorizer = new Apigatewayv2Authorizer(this, `${name}-gateway-authorizer`, {
      apiId:                api.id,
      name:                 `${name}-gateway-authorizer`,
      authorizerType:       'JWT',
      identitySources:      ['$request.header.Authorization'],
      jwtConfiguration: {
        audience:           [userPoolClient.resource.id],
        issuer:             `https://${userPool.resource.endpoint}`
      }
    });

    // API Stage
    const apiStage = new Apigatewayv2Stage(this, `${name}-gateway-stage`, {
      apiId:      api.id,
      name:       'dev',
      autoDeploy: true      
    });

    // API Certificate
    const apiDomainNameCertficate = new ServerlessStarterApiCertificate(this, `${name}-ssl-certificate`, this.provider);

    // API Domain Name with SSL Certificate
    const apiDomainName = new Apigatewayv2DomainName(this, `${name}-gateway-domain-name`, {
      provider:                   this.provider,
      domainName:                 defaultConfig.template.api.domain,
      domainNameConfiguration: {
        certificateArn:           apiDomainNameCertficate.resource.arn,
        endpointType:             defaultConfig.template.api.api_gateway.endpoint_type,
        securityPolicy:           defaultConfig.template.api.api_gateway.security_policy
      }
    });

    // Route53 records & alias linking to API
    new ServerlessStarterApiDomainNameRecord(this, `${name}-gateway-domain-name-record`, {
      name:                     apiDomainName.domainNameConfiguration.targetDomainName,
      zoneId:                   apiDomainName.domainNameConfiguration.hostedZoneId,
      evaluateTargetHealth:     false
    });

    new Apigatewayv2ApiMapping(this, `${name}-gateway-mapping`, {
      apiId:                    api.id,
      domainName:               apiDomainName.id,
      stage:                    apiStage.id      
    });

    const apiGatewayIntegration = new Apigatewayv2Integration(this, `${name}-gateway-integration`, {
      apiId:                    api.id,
      integrationType:          'AWS_PROXY',
      integrationMethod:        'POST',
      integrationUri:           lambdaFunc.invokeArn,
      timeoutMilliseconds:      30000 // 30 seconds,
    });

    // CORS Preflight Fix
    new Apigatewayv2Route(this, `${name}-gateway-proxy-options-route`, {
      apiId:                    api.id,
      authorizationType:        'NONE',
      routeKey:                 `OPTIONS /{proxy+}`,
      target:                   `integrations/${apiGatewayIntegration.id}`
    });

    // Default API Proxy to Lambda
    new Apigatewayv2Route(this, `${name}-gateway-proxy-route`, {
      apiId:                    api.id,
      authorizerId:             apiAuthorizer.id,
      authorizationType:        'JWT',
      routeKey:                 `ANY /{proxy+}`,
      target:                   `integrations/${apiGatewayIntegration.id}`
    });

    new LambdaPermission(this, `${name}-gateway-lambda`, {
      functionName: lambdaFunc.functionName,
      action:       'lambda:InvokeFunction',
      principal:    'apigateway.amazonaws.com',
      sourceArn:    `${api.executionArn}/*/*`,
    });

    // Generated Output
    new TerraformOutput(this, 'API_STACK', {
      value: {
        api: {
          arn:                api.arn,
          endpointDefault:    api.apiEndpoint,
          endpoint:           `https://${defaultConfig.template.api.domain}`,
        },
        cognito: {
          userPoolArn:        userPool.resource.arn,
          userPoolId:         userPool.resource.id,
          userPoolClientId:   userPoolClient.resource.id,
          userPoolIdentityId: userPoolIdentity.resource.id,
          issuer:             `https://${userPool.resource.endpoint}`
        },
        buckets: {
          tfstate: {
            arn:              tfStateBucket.resource.arn,
            domainName:       tfStateBucket.resource.bucketDomainName
          },
          deployment: {
            arn:              deployBucket.resource.arn,
            domainName:       deployBucket.resource.bucketDomainName
          }
        },
        vpc: {
          arn:                vpc.resource.arn,
          id:                 vpc.resource.id,
          natGatewayId:       natGateway.id,
          internetGatewayId:  internetGateway.id,
          publicSubnetIds:    [ ...vpcPublicSubnets.resource.map(subnet => subnet.id)  ],
          privateSubnetIds:   [ ...vpcPrivateSubnets.resource.map(subnet => subnet.id) ],
        },
        db: {
          instance: {
            arn:              rdsDbInstance.resource.arn,
            id:               rdsDbInstance.resource.id,
            identifier:       rdsDbInstance.resource.identifier,
            endpoint:         rdsDbInstance.resource.endpoint,            
            subnetGroupName:  rdsDbInstance.resource.dbSubnetGroupName
          },
          credentials: {
            secret: {
              id:             rdsDbCredentialsSecret.id,
              arn:            rdsDbCredentialsSecret.arn 
            } 
          }    
        }
      }
    });
  }
}
