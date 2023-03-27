// AWS Lambda
import { Context, Handler } from 'aws-lambda';

// Express JS
import { default as express } from 'express';
import { default as serverlessExpress } from '@vendia/serverless-express';

// Nest JS
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

// API
import { AppModule } from './app.module';
import { AppOptions } from './config/options';

// API Extensions
import { ExtensionServices } from './extensions';

let cachedServer: Handler;

async function bootstrap() {

  if (!cachedServer) {

    // Express JS
    const expressApp = express();

    // Nest JS
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), AppOptions);

    nestApp.setGlobalPrefix('v1');
    nestApp.enableCors();

    // Swagger Documentation
    const enableSwaggerDocumentation = 'true'; //process.env.ENABLE_SWAGGER_DOCUMENTATION;
    if (enableSwaggerDocumentation === 'true') {
      ExtensionServices.configureSwaggerDocumentation(nestApp);
    }

    // Initialize API
    await nestApp.init();

    // Express Wrapper
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
