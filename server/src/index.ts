import 'reflect-metadata';
import { AppDataSource } from './config/database';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    
    // Start server after DB connection is established
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  }); 