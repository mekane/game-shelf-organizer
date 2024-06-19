import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { allEntities } from './entities';

const database = 'database.sqlite';

export const sqlLiteOptions: TypeOrmModuleOptions = {
  type: 'sqlite',
  database,
  synchronize: true,
  logging: false,
  entities: allEntities,
  migrations: [],
  subscribers: [],
};

export const dataSource: DataSource = new DataSource({
  type: 'sqlite',
  database,
});
