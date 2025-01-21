export abstract class BookmakerBase {
  abstract name: string;
  abstract fetchOdds(sport: string): Promise<any>;
  
  protected async makeRequest(url: string) {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error(`Error fetching odds from ${this.name}:`, error);
      return null;
    }
  }
} 