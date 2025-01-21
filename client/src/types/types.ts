interface BookmakerOdds {
  name: string;
  odds: number;
}

export interface Odds {
  sport: string;
  event: string;
  startTime: Date;
  homeTeam: string;
  awayTeam: string;
  homeOdds: BookmakerOdds[];
  awayOdds: BookmakerOdds[];
}

export type Sport = 'football' | 'basketball' | 'tennis' | 'baseball';