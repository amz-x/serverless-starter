// Provider
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { RdsCluster } from '@cdktf/provider-aws/lib/rds-cluster';
import { DbProxy } from '@cdktf/provider-aws/lib/db-proxy';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { Vpc } from '@cdktf/provider-aws/lib/vpc';
import { Subnet } from '@cdktf/provider-aws/lib/subnet';
import { DbSubnetGroup } from '@cdktf/provider-aws/lib/db-subnet-group';
import { SecretsmanagerSecret } from '@cdktf/provider-aws/lib/secretsmanager-secret';

// TF - Constructs
import { Construct } from 'constructs';

// Constants
import { RDS_DEFAULTS, STACK_PREFIX } from '../constants';

// Config
import { defaultConfig } from '../config';
import { RdsClusterInstance } from '@cdktf/provider-aws/lib/rds-cluster-instance';
import { DbProxyDefaultTargetGroup } from '@cdktf/provider-aws/lib/db-proxy-default-target-group';
import { DbProxyTarget } from '@cdktf/provider-aws/lib/db-proxy-target';



export class ServerlessStarterRDSCluster extends Construct {

  // AWS RDS Cluster
  public readonly resource: RdsCluster;

  constructor(scope: Construct, name = `${STACK_PREFIX}-rds-cluster`, provider: AwsProvider, subnets: Subnet[]) {
    super(scope, name);

    // AWS DB Subnet Group
    new DbSubnetGroup(this, `${name}-subnet-group`, {
      provider:         provider,
      subnetIds:        [ ...subnets.map(subnet => subnet.id) ],
      name:             defaultConfig.template.rds?.subnetgroup.name,
      description:      defaultConfig.template.rds?.subnetgroup.description,
      tags:             defaultConfig.template.rds?.subnetgroup.tags
    });
    
    // https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster
    this.resource = new RdsCluster(this, name, {
      provider:                         provider,
      // Defaults
      engine:                           RDS_DEFAULTS.cluster.engine,
      engineVersion:                    RDS_DEFAULTS.cluster.engineVersion,
      networkType:                      RDS_DEFAULTS.cluster.networkType,
      allowMajorVersionUpgrade:         RDS_DEFAULTS.cluster.allowMajorVersionUpgrade,
      preferredBackupWindow:            RDS_DEFAULTS.cluster.preferredBackupWindow,
      preferredMaintenanceWindow:       RDS_DEFAULTS.cluster.preferredMaintenanceWindow,
      // Subnet Configuration
      dbSubnetGroupName:                defaultConfig.template.rds?.subnetgroup.name,
      //  Configuration  
      clusterIdentifier:                defaultConfig.template.rds?.cluster.identifier,
      sourceRegion:                     defaultConfig.template.rds?.cluster.region,
      availabilityZones:                defaultConfig.template.rds?.cluster.availabilityZones,
      databaseName:                     defaultConfig.template.rds?.cluster.name,
      masterUsername:                   defaultConfig.template.rds?.cluster.username,
      masterPassword:                   defaultConfig.template.rds?.cluster.password,
      port:                             defaultConfig.template.rds?.cluster.port,
      skipFinalSnapshot:                defaultConfig.template.rds?.cluster.skipFinalSnapshot,
      copyTagsToSnapshot:               defaultConfig.template.rds?.cluster.copyTagsToSnapshot,
      storageEncrypted:                 defaultConfig.template.rds?.cluster.storageEncrypted,
      tags:                             defaultConfig.template.rds?.cluster.tags,
      serverlessv2ScalingConfiguration: defaultConfig.template.rds?.cluster.scalingConfig      
    });
  }
}

export class ServerlessStarterRdsClusterInstance extends Construct {

  public readonly resource: RdsClusterInstance;

  constructor(scope: Construct, name = `${STACK_PREFIX}-rds-cluster-db-instance`, provider: AwsProvider, rdsCluster: RdsCluster) {
    super(scope, name);

    // RDS Cluster Instance
    this.resource = new RdsClusterInstance(this, `${name}-dev`, {
      provider:                         provider,
      // RDS Cluster Configuration
      identifier:                       `${name}-dev-1`,
      clusterIdentifier:                rdsCluster.id,
      engine:                           rdsCluster.engine,
      engineVersion:                    rdsCluster.engineVersion,
      // Defaults
      instanceClass:                    RDS_DEFAULTS.database.instanceClass,
      autoMinorVersionUpgrade:          RDS_DEFAULTS.database.autoMinorVersionUpgrade,
      preferredMaintenanceWindow:       RDS_DEFAULTS.database.preferredMaintenanceWindow,
      // Subnet Configuration
      dbSubnetGroupName:                defaultConfig.template.rds?.subnetgroup.name,
      // Configuration
      copyTagsToSnapshot:               defaultConfig.template.rds?.database.copyTagsToSnapshot,
      publiclyAccessible:               defaultConfig.template.rds?.database.publiclyAccessible,
      performanceInsightsEnabled:       defaultConfig.template.rds?.database.enablePerfInsights,
      tags:                             defaultConfig.template.rds?.database.tags
    });
  }
}

export class ServerlessStarterDBProxy extends Construct {

  // AWS RDS DB Proxy
  public readonly resource: DbProxy;

  constructor(scope: Construct, name = `${STACK_PREFIX}-rds-db-proxy`, provider: AwsProvider, vpc: Vpc, subnets: Subnet[], role: IamRole, secret: SecretsmanagerSecret) {
    super(scope, name);
    
    // RDS DB Proxy
    this.resource = new DbProxy(this, name, {
      provider:             provider,
      roleArn:              role.arn,
      vpcSubnetIds:         [ ...subnets.map(subnet => subnet.id) ],
      vpcSecurityGroupIds:  [ vpc.defaultSecurityGroupId ],
      auth:                 [{ ...RDS_DEFAULTS.proxy.auth, secretArn: secret.arn }],
      engineFamily:         RDS_DEFAULTS.proxy.engineFamily,
      idleClientTimeout:    RDS_DEFAULTS.proxy.idleClientTimeout,
      requireTls:           RDS_DEFAULTS.proxy.requireTls,
      name:                 defaultConfig.template.rds?.proxy.name || '',
      debugLogging:         defaultConfig.template.rds?.proxy.debug,
      tags:                 defaultConfig.template.rds?.proxy.tags
    });
  }
}

export class ServerlessStarterDBProxyTarget extends Construct {

  // AWS RDS DB Proxy Target
  public readonly resource: DbProxyTarget;

  constructor(scope: Construct, name = `${STACK_PREFIX}-db-proxy-target`, provider: AwsProvider, rdsCluster: RdsCluster, dbProxy: DbProxy) {
    super(scope, name);

    // RDS DB Proxy Target Group
    const dbProxyTargetGroup = new DbProxyDefaultTargetGroup(this, `${name}-group`, {
      provider:             provider,
      dbProxyName:          dbProxy.name,
      connectionPoolConfig: RDS_DEFAULTS.proxy.connectionPoolConfig
    });

    // RDS DB Proxy Target
    this.resource = new DbProxyTarget(this, name, {
      provider:             provider,
      dbClusterIdentifier:  rdsCluster.id,
      dbProxyName:          dbProxy.name,
      targetGroupName:      dbProxyTargetGroup.name
    });
  }
}
