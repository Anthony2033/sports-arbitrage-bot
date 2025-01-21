import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';

export class UserService {
  private static userRepository = AppDataSource.getRepository(User);

  static async createUser(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({
      email,
      passwordHash
    });

    return await this.userRepository.save(user);
  }

  static async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }
} 