import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Subnet } from '@cdktf/provider-aws/lib/subnet';
import { Vpc } from '@cdktf/provider-aws/lib/vpc';

// Construct
import { Construct } from 'constructs/lib/construct';

// Constants
import { STACK_PREFIX } from '../constants';

// Configuration
import { defaultConfig } from '../config';



export class ServerlessStarterVPC extends Construct {

  // AWS VPC
  public readonly resource: Vpc;

  constructor(scope: Construct, name = `${STACK_PREFIX}-vpc`, provider: AwsProvider) {
    super(scope, name);

    // VPC
    this.resource = new Vpc(this, name, {
      provider:                     provider,
      cidrBlock:                    defaultConfig.template.vpc.cidrBlock,
      assignGeneratedIpv6CidrBlock: defaultConfig.template.vpc.enableIpv6CidrBlock,
      enableDnsHostnames:           defaultConfig.template.vpc.enableDnsHostnames,
      enableDnsSupport:             defaultConfig.template.vpc.enableDnsSupport,
      tags:                         defaultConfig.template.vpc.tags
    });
  }
}

export class ServerlessStarterVPCPublicSubnets extends Construct {

  // AWS VPC Public Subnets
  public readonly resource: Subnet[];

  constructor(scope: Construct, name = `${STACK_PREFIX}-vpc-public-subnets`, provider: AwsProvider, vpc: Vpc) {
    super(scope, name);

    this.resource = [ 
      new Subnet(this, `${name}-1`, {
        provider:         provider,
        vpcId:            vpc.id,
        ipv6Native:       defaultConfig.template.vpc.publicSubnet.ipv6Native,
        availabilityZone: defaultConfig.template.vpc.publicSubnet.availabilityZone,
        cidrBlock:        defaultConfig.template.vpc.publicSubnet.cidrBlock,
        tags:             defaultConfig.template.vpc.publicSubnet.tags
      })
    ];
  }
}

export class ServerlessStarterVPCPrivateSubnets extends Construct {

  // AWS VPC Private Subnets
  public readonly resource: Subnet[];

  constructor(scope: Construct, name = `${STACK_PREFIX}-vpc-private-subnets`, provider: AwsProvider, vpc: Vpc) {
    super(scope, name);

    this.resource = [
      new Subnet(this, `${name}-1`, {
        provider:         provider,
        vpcId:            vpc.id,
        ipv6Native:       defaultConfig.template.vpc.privateSubnets[0].ipv6Native,
        availabilityZone: defaultConfig.template.vpc.privateSubnets[0].availabilityZone,
        cidrBlock:        defaultConfig.template.vpc.privateSubnets[0].cidrBlock,
        tags:             defaultConfig.template.vpc.privateSubnets[0].tags
      }),
      new Subnet(this, `${name}-2`, {
        provider:         provider,
        vpcId:            vpc.id,
        ipv6Native:       defaultConfig.template.vpc.privateSubnets[1].ipv6Native,
        availabilityZone: defaultConfig.template.vpc.privateSubnets[1].availabilityZone,
        cidrBlock:        defaultConfig.template.vpc.privateSubnets[1].cidrBlock,
        tags:             defaultConfig.template.vpc.privateSubnets[1].tags
      }),
      new Subnet(this, `${name}-3`, {
        provider:         provider,
        vpcId:            vpc.id,
        ipv6Native:       defaultConfig.template.vpc.privateSubnets[2].ipv6Native,
        availabilityZone: defaultConfig.template.vpc.privateSubnets[2].availabilityZone,
        cidrBlock:        defaultConfig.template.vpc.privateSubnets[2].cidrBlock,
        tags:             defaultConfig.template.vpc.privateSubnets[2].tags
      }),
    ];
  }
}
