// Provider
import { AwsProvider }    from '@cdktf/provider-aws/lib/provider';
import { Vpc }            from '@cdktf/provider-aws/lib/vpc';
import { DbInstance }     from '@cdktf/provider-aws/lib/db-instance';
import { DbSubnetGroup }  from '@cdktf/provider-aws/lib/db-subnet-group';
import { Subnet }         from '@cdktf/provider-aws/lib/subnet';

// TF - Constructs
import { Construct } from 'constructs';

// Constants
import { STACK_PREFIX } from '../constants';

// Config
import { defaultConfig } from '../config';

export class ServerlessStarterRdsDbInstance extends Construct {

  public readonly resource: DbInstance;

  constructor(scope: Construct, name = `${STACK_PREFIX}-rds-db-instance`, provider: AwsProvider, vpc: Vpc, subnets: Subnet[]) {
    super(scope, name);

    // AWS DB Subnet Group
    const dbSubnetGroup = new DbSubnetGroup(this, `${name}-subnet-group`, {
      provider:         provider,
      subnetIds:        [ ...subnets.map(subnet => subnet.id) ],
      name:             defaultConfig.template.db.subnetGroup.name,
      description:      defaultConfig.template.db.subnetGroup.description,
      tags:             defaultConfig.template.db.subnetGroup.tags
    });

    // AWS DB Instance
    this.resource = new DbInstance(this, `${name}-dev`, {
      // Provider
      provider:                         provider,
      // VPC Configuration
      vpcSecurityGroupIds:              [ vpc.defaultSecurityGroupId ],
      // DB Subnet Group
      dbSubnetGroupName:                dbSubnetGroup.name,
      // DB Instance Credentails
      identifier:                       defaultConfig.template.db.identifier,
      dbName:                           defaultConfig.template.db.name,
      username:                         defaultConfig.template.db.username,
      password:                         defaultConfig.template.db.password,
      port:                             defaultConfig.template.db.port,
      // DB Instance Configurations
      publiclyAccessible:               defaultConfig.template.db.publiclyAccessible,
      allocatedStorage:                 defaultConfig.template.db.allocatedStorage,
      maxAllocatedStorage:              defaultConfig.template.db.maxAllocatedStorage,
      storageEncrypted:                 defaultConfig.template.db.storageEncrypted,
      engine:                           defaultConfig.template.db.engine,
      engineVersion:                    defaultConfig.template.db.engineVersion,
      instanceClass:                    defaultConfig.template.db.instanceClass,
      optionGroupName:                  defaultConfig.template.db.optionGroupName,
      multiAz:                          defaultConfig.template.db.multiAz,
      skipFinalSnapshot:                defaultConfig.template.db.skipFinalSnapshot,
      copyTagsToSnapshot:               defaultConfig.template.db.copyTagsToSnapshot,
      maintenanceWindow:                defaultConfig.template.db.maintenanceWindow,
      tags:                             defaultConfig.template.db.tags
    });
  }
}
