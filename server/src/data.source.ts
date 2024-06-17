import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { allEntities } from './entities';

export const sqlLiteOptions: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: allEntities,
  migrations: [],
  subscribers: [],
};
