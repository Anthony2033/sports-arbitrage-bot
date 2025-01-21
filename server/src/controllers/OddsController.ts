import { Request, Response } from 'express'
import { oddsService } from '../services/OddsService'
import { oddsApiBookmaker } from '../services/bookmakers/OddsApiBookmaker'

export class OddsController {
  async getOdds(req: Request, res: Response) {
    try {
      const { sport } = req.params
      
      // Get fresh data from API
      const apiData = await oddsApiBookmaker.getOdds(sport)
      
      // Save to database
      await oddsService.saveOdds(apiData)
      
      // Return the data
      res.json(apiData)
    } catch (error) {
      console.error('Error fetching odds:', error)
      res.status(500).json({ error: 'Failed to fetch odds' })
    }
  }

  async getStoredOdds(req: Request, res: Response) {
    try {
      const { sport } = req.params
      const odds = await oddsService.getRecentOdds(sport)
      res.json(odds)
    } catch (error) {
      console.error('Error fetching stored odds:', error)
      res.status(500).json({ error: 'Failed to fetch stored odds' })
    }
  }
}

export const oddsController = new OddsController() 