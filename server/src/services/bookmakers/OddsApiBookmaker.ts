import fetch from 'node-fetch'

export class OddsApiBookmaker {
  private apiKey = process.env.ODDS_API_KEY
  private baseUrl = 'https://api.the-odds-api.com/v4'

  async getOdds(sport: string): Promise<any> {
    const url = `${this.baseUrl}/sports/${sport}/odds/?apiKey=${this.apiKey}&regions=us&markets=h2h`
    const response = await fetch(url)
    const data = await response.json()
    return this.transformOddsData(data)
  }

  private transformOddsData(data: any[]): any[] {
    return data.map(event => ({
      sport: event.sport_title,
      event: `${event.home_team} vs ${event.away_team}`,
      startTime: new Date(event.commence_time),
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      homeOdds: event.bookmakers.map((b: any) => ({
        name: b.title,
        odds: b.markets[0]?.outcomes.find((o: any) => o.name === event.home_team)?.price || 0
      })),
      awayOdds: event.bookmakers.map((b: any) => ({
        name: b.title,
        odds: b.markets[0]?.outcomes.find((o: any) => o.name === event.away_team)?.price || 0
      }))
    }))
  }
}

export const oddsApiBookmaker = new OddsApiBookmaker() 