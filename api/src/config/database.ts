import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConnectionManager, getConnectionManager } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

    const connectionManager: ConnectionManager = getConnectionManager();

    let options: TypeOrmModuleOptions;

    if (connectionManager.has('default')) {
      options = connectionManager.get('default').options;
      await connectionManager.get('default').destroy();
    } else {
      options = {
        type:             'postgres',
        host:             process.env.API_DATABASE_HOST || '127.0.0.1',
        database:         process.env.API_DATABASE_NAME || '',
        username:         process.env.API_DATABASE_USER || '',
        password:         process.env.API_DATABASE_PASS || '',
        port:             process.env.NODE_ENV === 'production' ? 5432 : 5555,  
        autoLoadEntities: true,
        synchronize:      true,
        useUTC:           true
      };

      // Temporary Fix
      let host = String(options.host);
      if (host.indexOf(':') !== -1) {
        host = host.substring(0, host.indexOf(':'));
        options = {
          ...options,
          host
        }
      }
    }
    return options;
  }
}
