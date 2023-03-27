// NestJS
import { NestFactory } from '@nestjs/core';

// Extensions
import { ExtensionServices } from './extensions';

// App Options
import { AppModule } from './app.module';
import { AppOptions } from './config/options';

/**
 * Bootstrap App to Server function
 */
async function bootstrap() {

  // Nest JS Application
  const nestApp = await NestFactory.create(AppModule, AppOptions);

  nestApp.setGlobalPrefix('v1');
  nestApp.enableCors();

  // Swagger Documentation
  const enableSwaggerDocumentation = 'true';
  if (enableSwaggerDocumentation === 'true') {
    ExtensionServices.configureSwaggerDocumentation(nestApp);
  }

  // Initialize Application
  const port = process.env.PORT || 3000;
  await nestApp.listen(port);
 
   console.log(`Application is running on: ${await nestApp.getUrl()}`);
}


bootstrap();

