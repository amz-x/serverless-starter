import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Configuration
import { TypeOrmConfigService } from './config/database';

// App Controller & Service
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { TasksModule } from './tasks/tasks.module';
import { LoggerModule } from './logger/logger.module';


@Module({
  imports: [
    // ConfigModule.forRoot({
    //   cache: true,
    //   load:  [config, databaseConfig],
    // }),
    TypeOrmModule.forRootAsync({
      inject:   [ ConfigModule ],
      useClass: TypeOrmConfigService
    }),
    TasksModule,
    LoggerModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
