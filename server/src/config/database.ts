import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'odds_comparison',
  entities: ['src/entities/*.{ts,js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Disable in production
  logging: process.env.NODE_ENV !== 'production'
}); 