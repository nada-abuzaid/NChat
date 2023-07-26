import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db: string = process.env.DB_URL!;

const options: PoolConfig = {
  connectionString: db,
  ssl: false,
};

const connection: Pool = new Pool(options);

export default connection;