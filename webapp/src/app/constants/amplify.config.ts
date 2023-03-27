// AWS Amplify Configuration Type
import { Auth } from 'aws-amplify';
import { AmplifyConfig } from 'aws-amplify/lib-esm/Common/types/types';

// Environment Vars
import { environment } from '../../environments/environment';

// API NAME
export const API_NAME = 'API';

// AWS Amplify Auth Configuration
const authConfig = Object.freeze({
  identityPoolId:         environment.AUTH_IDP_ID,
  userPoolId:             environment.AUTH_USER_POOL_ID,
  userPoolWebClientId:    environment.AUTH_CLIENT_ID,
  region:                 environment.AUTH_REGION,
  authenticationFlowType: 'USER_PASSWORD_AUTH'
});

// AWS Amplify API Config
const apiConfig = Object.freeze({
  endpoints: [{
    name:          API_NAME,
    endpoint:      environment.API_URL,
    custom_header: async () => {
      return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` };
    }
  }]
});

// AWS Amplify Configuration
export const config: AmplifyConfig = {
  API:  { ...apiConfig  },
  Auth: { ...authConfig },
};
