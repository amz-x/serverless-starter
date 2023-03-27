import { IServerlessConfig } from '../interfaces/config';

/**
 * Default Configuration Example
 * 
 * Create a copy of this file name it to `index.ts`, and replace values as needed
 */
export const defaultConfig: IServerlessConfig = Object.freeze({
  root_domain_name:         'example.com',          // AWS Route53 Root Domain Name
  zone_id:                  'XXXXXXXXXXXXX',        // AWS Route53 Zone ID
  profile:                  'example',              // AWS Account Profile
  account_id:               'XXXXXXXXXXXXX',        // AWS Account ID
  region:                   'eu-west-2',            // AWS Region (Regional Setup)
  tag:                      'serverless-starter',   // AWS Services Tag
  template: {
    api: {
      domain:               'api.serverless.example.com',
      region:               'eu-west-2',
      provider: {
        region:             'eu-west-2',
        alias:              'london'
      },
      bucket: {
        enable:             true,
        create:             true,
        region:             'eu-west-2',
        domain:             'deploys.serverless.example.com',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'api',
          Subtype:          'bucket',
          Region:           'eu-west-2'
        }
      },
      certificate: {
        enable:             true,
        create:             true,
        region:             'eu-west-2',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'api',
          Subtype:          'certificate',
          Region:           'eu-west-2'
        }           
      },
      api_gateway: {
        enable:             true,
        create:             true,
        endpoint_type:      'REGIONAL',
        security_policy:    'TLS_1_2',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'api',
          Subtype:          'gateway',
          Region:           'eu-west-2'
        }  
      },
      lambda: {
        enable:             true,
        create:             true,
        directory:          '',
        timeout:            30,
        memory:             128,
        tags: {
          Stack:            'serverless-starter',
          Sub:              'api',
          Subtype:          'lambda',
          Region:           'eu-west-2'
        }
      }
    },
    cognito: {
      provider: {
        region:             'eu-west-1',
        alias:              'ireland'
      },
      tags: {
        Stack:              'serverless-starter',
        Sub:                'authentication',
        Region:             'eu-west-1'
      }
    },
    vpc: {
      name:                 'serverless-vpc',
      region:               'eu-west-2',
      cidrBlock:            'XX.XX.0.0/16',
      enableIpv6CidrBlock:  false,  
      enableDnsSupport:     true,
      enableDnsHostnames:   true,
      tags: {
        Stack:              'serverless-starter',
        Sub:                'vpc',
        Region:             'eu-west-2'
      },
      publicSubnet: {
        cidrBlock:          'XX.XX.0.0/20',
        availabilityZone:   'eu-west-2a',
        ipv6Native:         false,
        tags: {
          Stack:            'serverless-starter',
          Sub:              'vpc',
          Subtype:          'public-subnet-1',
          Region:           'eu-west-2'
        }
      },
      privateSubnets: [
        {
          cidrBlock:        'XX.XX.16.0/20',
          availabilityZone: 'af-south-1a',
          ipv6Native:       false,
          tags: {
            Stack:          'serverless-starter',
            Sub:            'vpc',
            Subtype:        'private-subnet-1',
            Region:         'eu-west-2'
          }
        },
        {
          cidrBlock:        'XX.XX.32.0/20',
          availabilityZone: 'eu-west-2b',
          ipv6Native:       false,
          tags: {
            Stack:          'serverless-starter',
            Sub:            'vpc',
            Subtype:        'private-subnet-2',
            Region:         'eu-west-2'
          }
        },
        {
          cidrBlock:        'XX.XX.48.0/20',
          availabilityZone: 'eu-west-2c',
          ipv6Native:       false,
          tags: {
            Stack:          'serverless-starter',
            Sub:            'vpc',
            Subtype:        'private-subnet-3',
            Region:         'eu-west-2'
          }
        }
      ],
    },
    db: {
      identifier:           'serverless-starter-db-instance',
      name:                 'postgres',
      username:             'example_username',
      password:             'example_password',
      port:                 5432,
      region:               'eu-west-2',
      instanceClass:        'db.t3.micro',
      engine:               'postgres',
      engineVersion:        '14.7',
      optionGroupName:      'default:postgres-14',
      storageType:          'gp2',
      networkType:          'IPV4',
      maintenanceWindow:    'Mon:03:00-Mon:06:00',
      allocatedStorage:     10,
      maxAllocatedStorage:  20,
      storageEncrypted:     true,
      copyTagsToSnapshot:   true,
      skipFinalSnapshot:    true,
      publiclyAccessible:   true,
      multiAz:              false,
      subnetGroup: {
        name:               'serverless-starter-db-instance-subnet-group',
        description:        'Serverless Starter Database Subnet Group',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'rds',
          Subtype:          'db-subnet-group',
          Region:           'eu-west-2'
        }
      },
      tags: {
        Stack:              'serverless-starter',
        Sub:                'rds',
        Subtype:            'db-instance',
        Region:             'eu-west-2'
      }
    },
    terraform: {
      bucket: {
        enable:             true,
        create:             true,
        region:             'eu-west-2',
        domain:             'state.serverless.example.com',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'terraform',
          Region:           'eu-west-2'
        }
      }
    },
    webapp: {
      domain:               'app.serverless.example.com',
      bucket: {
        enable:             true,
        create:             true,
        region:             'eu-west-2',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'webapp',
          Subtype:          'bucket',
          Region:           'eu-west-2'
        }
        
      },
      certificate: {
        enable:             true,
        create:             true,
        region:             'us-east-1',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'webapp',
          Subtype:          'certificate',
          Region:           'us-east-1'
        }
      },
      cloudfront: {
        enable:             true,
        create:             true,
        compress:           true,
        price_class:        'PriceClass_200',
        tags: {
          Stack:            'serverless-starter',
          Sub:              'webapp',
          Subtype:          'cloudfront'
        }
      } 
    }  
  }
});
