export interface IServerlessTagsConfig {
  [key: string]:        string;
};

export interface IServerlesProviderConfig {
  region:               string;
  alias:                string;
};

export interface IServerlessCognitoConfig {
  provider:             IServerlesProviderConfig;
  tags:                 IServerlessTagsConfig;
};

export interface IServerlessTerraformConfig {
  bucket: {
    enable:             boolean;
    create:             boolean;
    region:             string;
    domain:             string;
    tags:               IServerlessTagsConfig;
  }
};

export interface IServerlessWebAppConfig {
  domain:               string;
  bucket: {
    enable:             boolean;
    create:             boolean;
    region:             string;
    tags:               IServerlessTagsConfig;
  },
  certificate: {
    enable:             boolean;
    create:             boolean;
    region:             string;
    tags:               IServerlessTagsConfig;
  },
  // https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution
  cloudfront: {
    enable:             boolean;
    create:             boolean;
    compress:           boolean;
    price_class:        string;
    tags:               IServerlessTagsConfig;
  } 
}

export interface IServerlessAPIConfig {
  domain:               string;
  region:               string;
  provider: {
    region:             string;
    alias:              string;
  },
  bucket: {
    enable:             boolean,
    create:             boolean,
    region:             string;
    domain:             string;
    tags:               IServerlessTagsConfig;
  },
  certificate: {
    enable:             boolean;
    create:             boolean;
    region:             string;
    tags:               IServerlessTagsConfig;     
  },
  api_gateway: {
    enable:             boolean;
    create:             boolean;
    endpoint_type:      string;
    security_policy:    string;
    tags:               IServerlessTagsConfig;
  },
  lambda: {
    enable:             boolean;
    create:             boolean;
    directory:          string;
    timeout:            number;
    memory:             number;
    tags:               IServerlessTagsConfig;
  }
};

export interface IServerlessDbSubnetGroup {
  name:               string;
  description:        string;
  tags:               IServerlessTagsConfig;
}

export interface IServerlessDBInstanceConfig {
  identifier:           string;
  name:                 string;
  username:             string;
  password:             string;
  port:                 number;
  region:               string;
  instanceClass:        string;
  engine:               string;
  engineVersion:        string;
  storageType:          string;
  optionGroupName:      string;
  allocatedStorage:     number;
  maxAllocatedStorage:  number;
  storageEncrypted:     boolean;
  copyTagsToSnapshot:   boolean;
  skipFinalSnapshot:    boolean;
  publiclyAccessible:   boolean;
  multiAz:              boolean;
  maintenanceWindow:    string;
  subnetGroup:          IServerlessDbSubnetGroup;
  tags:                 IServerlessTagsConfig;
};

export interface IServerlessRDSConfig {
  cluster: {
    identifier:         string;
    name:               string;
    username:           string;
    password:           string;
    port:               number;
    availabilityZones:  string[];
    scalingConfig:      { maxCapacity: number; minCapacity: number };
    copyTagsToSnapshot: boolean;
    skipFinalSnapshot:  boolean;
    storageEncrypted:   boolean;
    region:             string;
    tags:               IServerlessTagsConfig;
  },
  database: {
    identifier:         string;
    name:               string;
    copyTagsToSnapshot: boolean;
    skipFinalSnapshot:  boolean;
    storageEncrypted:   boolean;
    enablePerfInsights: boolean;
    publiclyAccessible: boolean;
    region:             string;
    tags:               IServerlessTagsConfig;
  },
  subnetgroup: {
    name:               string;
    description:        string;
    tags:               IServerlessTagsConfig;
  },
  proxy: {
    name:               string;
    debug:              boolean;
    tags:               IServerlessTagsConfig;
  }
};

export interface IServerlessVPCSubnetConfig {
  cidrBlock:            string;
  availabilityZone:     string;
  ipv6Native:           boolean;
  tags:                 IServerlessTagsConfig;
};

export interface IServerlessVPCConfig {
  name:                 string;
  region:               string;
  cidrBlock:            string;
  enableIpv6CidrBlock:  boolean;  
  enableDnsSupport:     boolean;
  enableDnsHostnames:   boolean;
  publicSubnet:         IServerlessVPCSubnetConfig;
  privateSubnets:       IServerlessVPCSubnetConfig[];
  tags:                 IServerlessTagsConfig;
}

export interface IServerlessTemplateConfig {
  api:                  IServerlessAPIConfig;
  cognito:              IServerlessCognitoConfig;
  terraform:            IServerlessTerraformConfig;
  vpc:                  IServerlessVPCConfig;
  db:                   IServerlessDBInstanceConfig;
  rds?:                 IServerlessRDSConfig;
  webapp:               IServerlessWebAppConfig;
};

export interface IServerlessConfig {
  root_domain_name:     string;
  zone_id:              string;
  account_id:           string;
  profile:              string;
  region:               string;
  template:             IServerlessTemplateConfig;
};
