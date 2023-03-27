export interface ServerlessStarterBundleFunctionProps {
  path:           string;
  target:         'es2018' | 'es2020';
};

export interface ServerlessStarterBucketProps {
  region:         string;
  subdomain:      string;
};

export interface ServerlessStarterCloudfrontConfigProps {
  enabled:        boolean;
  subdomain:      string;
};

export interface ServerlessWebAppConfigProps {
  path:           string;
  runtime:        string;
  stageName:      string;
  version:        string;
};

export interface ServerlessAPILambdaFunctionConfigProps {
  path:           string;
  handler:        string;
  runtime:        string;
  stageName:      string;
  version:        string;
};
