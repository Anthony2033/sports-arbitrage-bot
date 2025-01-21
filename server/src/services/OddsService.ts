import { AppDataSource } from '../config/database';
import { Odds } from '../entities/Odds';
import { MoreThan } from 'typeorm';

export class OddsService {
  private oddsRepository = AppDataSource.getRepository(Odds);

  async saveOdds(oddsData: Partial<Odds>[]): Promise<Odds[]> {
    const odds = this.oddsRepository.create(oddsData.map(data => ({
      ...data,
      lastUpdated: new Date()
    })));
    return this.oddsRepository.save(odds);
  }

  async getRecentOdds(sport: string): Promise<Odds[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return this.oddsRepository.find({
      where: {
        sport,
        startTime: MoreThan(twentyFourHoursAgo)
      },
      order: {
        startTime: 'ASC'
      }
    });
  }
}

export const oddsService = new OddsService(); 