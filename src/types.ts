export interface TeamValue {
  cByHits: number;
  tlCByHits: number;
  cByAHits: number;
  tlCByHitsRuns: number;
  differential: number;
  runs: number;
  runsA: number;
  gp: number;
  name: string;
  opponentName: string;
  date: Date;
}

export interface SeasonStatistics {
  totalGames: number;
  correctPredictions: number;
  losersWins: number;
  totalLosersGames: number;
}

export interface Parameters {
  startYear: number;
  endYear: number;
  days: number;
  daysInYear: number;
  loser500: number;
  differenceParameter: number;
}