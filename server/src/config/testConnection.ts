import { AppDataSource } from './database'
import 'dotenv/config'

async function testConnection() {
  try {
    await AppDataSource.initialize()
    console.log('Database connection established successfully!')
    
    // Test query
    const result = await AppDataSource.query('SELECT NOW()')
    console.log('Test query result:', result)
    
  } catch (error) {
    console.error('Error connecting to database:', error)
  } finally {
    await AppDataSource.destroy()
  }
}

testConnection() 