import { defineStore } from 'pinia'
import type { Odds } from '../types/types'
import { oddsApiService } from '../services/oddsApi'

interface OddsState {
  allOdds: Odds[]
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
}

export const useOddsStore = defineStore('odds', {
  state: (): OddsState => ({
    allOdds: [],
    lastUpdated: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getOddsBySport: (state) => (sport: string) => {
      return state.allOdds.filter(odd => 
        odd.sport.toLowerCase() === 'nba' && sport === 'basketball' ||
        odd.sport.toLowerCase() === 'nfl' && sport === 'football' ||
        odd.sport.toLowerCase() === 'mlb' && sport === 'baseball' ||
        odd.sport.toLowerCase() === 'atp' && sport === 'tennis'
      )
    },

    getEventByName: (state) => (eventName: string) => {
      return state.allOdds.find(odd => odd.event === eventName)
    }
  },

  actions: {
    async fetchOdds(sport: string) {
      if (this.isLoading) return

      this.isLoading = true
      this.error = null
      
      try {
        const data = await oddsApiService.getOddsBySport(sport)
        this.allOdds = data
        this.lastUpdated = new Date()
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch odds data'
        console.error('Error fetching odds:', e)
      } finally {
        this.isLoading = false
      }
    }
  }
}) 