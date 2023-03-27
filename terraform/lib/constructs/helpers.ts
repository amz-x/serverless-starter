
// Nodejs Path
import * as path    from 'node:path';
import { execSync } from 'child_process';

// TF - Constructs
import { Construct } from 'constructs';

// Constants
import { STACK_PREFIX } from '../constants';

// Config
import { defaultConfig } from '../config';

export class ServerlessStarterDeployWebAppHelper extends Construct {

  constructor(scope: Construct, name = `${STACK_PREFIX}-deploy-app-helper`, props: { path: string }) {
      super(scope, name);

      const workingDirectory = path.resolve(__dirname, `../${props.path}`);

      const options = { shell: '/bin/bash', cwd: workingDirectory };

      // AWS CLI with S3 Sync
      execSync(`aws s3 sync dist/ s3://${defaultConfig.template.webapp.domain} --delete --acl public-read`, options);
  }
}
