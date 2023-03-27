const { writeFile } = require('fs');
const { argv }      = require('yargs');   // read environment variables from .env file

require('dotenv').config();               // read the command line arguments passed with yargs

const environment   = argv.environment;
const isProduction  = environment === 'prod';
const targetPath    = `./src/environments/environment${isProduction ? '.prod.ts' : '.ts'}`;

// in the process.env object thanks to dotenv

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   API_URL: '${process.env['WEBAPP_API_URL'] ?? 'http://localhost:3000/v1'}',
   AUTH_IDP_ID: '${process.env['WEBAPP_AUTH_IDP_ID'] ?? ''}',
   AUTH_CLIENT_ID: '${process.env['WEBAPP_AUTH_CLIENT_ID'] ?? ''}',
   AUTH_USER_POOL_ID: '${process.env['WEBAPP_AUTH_USER_POOL_ID'] ?? ''}',
   AUTH_REGION: '${process.env['WEBAPP_AUTH_REGION'] ?? ''}'
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => (
  err ? console.error(err) : console.log(`Wrote variables to ${targetPath}`)
));
