import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

export class ExtensionServices {

  public static configureSwaggerDocumentation (app: INestApplication) {
    
    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('Serverless API Example')
      .setDescription('The serverless API example description')
      .setVersion('1.0')
      .build();
    
    // Swagger Document
    const document = SwaggerModule.createDocument(app, config);

    // Swagger UI dist (unpkg)
    const unpkgUiDistBaseUrl = 'https://unpkg.com/swagger-ui-dist@4.15.5';
    
    // Swagger Setup Options
    const options: SwaggerCustomOptions = {
      useGlobalPrefix: true,
      customCssUrl: `${unpkgUiDistBaseUrl}/swagger-ui.css`,
      customJs: [ 
        `${unpkgUiDistBaseUrl}/swagger-ui-bundle.js`,
        `${unpkgUiDistBaseUrl}/swagger-ui-standalone-preset.js`
      ]
    };
    
    // Swagger Module 
    // URL Path: /api/v1/docs
    SwaggerModule.setup('/docs', app, document, options);
  }
}

