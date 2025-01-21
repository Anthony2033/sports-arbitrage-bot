const API_KEY = 'de694d6f4e2b554d40f3f51ddd3ce270'
const BASE_URL = 'https://api.the-odds-api.com/v4'

export const oddsApiService = {
  async getOddsBySport(sport: string) {
    try {
      // Get odds directly for the mapped sport
      const sportKey = this.mapSportToApi(sport)
      const url = `${BASE_URL}/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h`
      
      console.log('Fetching from URL:', url)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Raw API data:', data)

      const transformedData = this.transformOddsData(data)
      console.log('Transformed data:', transformedData)

      return transformedData
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  mapSportToApi(sport: string): string {
    const sportMap: Record<string, string> = {
      'basketball': 'basketball_nba',
      'football': 'americanfootball_nfl',
      'baseball': 'baseball_mlb',
      'tennis': 'tennis_atp'
    }
    return sportMap[sport] || sport
  },

  transformOddsData(data: any[]): any[] {
    if (!Array.isArray(data)) {
      console.warn('Received non-array data:', data)
      return []
    }

    return data
      .filter(event => event.bookmakers?.length > 0)
      .map(event => {
        // Get all bookmaker odds for home and away
        const homeOdds = event.bookmakers.map((b: any) => ({
          name: b.title,
          odds: b.markets[0]?.outcomes.find((o: any) => o.name === event.home_team)?.price || 0
        })).filter((o: any) => o.odds > 0)
        .sort((a: any, b: any) => b.odds - a.odds); // Sort by best odds first

        const awayOdds = event.bookmakers.map((b: any) => ({
          name: b.title,
          odds: b.markets[0]?.outcomes.find((o: any) => o.name === event.away_team)?.price || 0
        })).filter((o: any) => o.odds > 0)
        .sort((a: any, b: any) => b.odds - a.odds);

        return {
          sport: event.sport_title,
          event: `${event.home_team} vs ${event.away_team}`,
          startTime: new Date(event.commence_time),
          homeTeam: event.home_team,
          awayTeam: event.away_team,
          homeOdds,
          awayOdds
        }
      })
      .filter(odd => odd.homeOdds.length > 0 && odd.awayOdds.length > 0)
  }
} 