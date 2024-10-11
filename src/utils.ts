import { TeamValue, SeasonStatistics, Parameters } from './types';

export const processSeasons = async (
  parameters: Parameters,
  updateProgress: (year: number, percentage: number) => void
): Promise<[SeasonStatistics, number[]]> => {
  const { startYear, endYear } = parameters;
  const seasonsPercentages: number[] = [];
  const statistics: SeasonStatistics = {
    totalGames: 0,
    correctPredictions: 0,
    losersWins: 0,
    totalLosersGames: 0,
  };
  const teamValues: Record<string, TeamValue[]> = {};

  for (let year = startYear; year <= endYear; year++) {
    const result = await processSeason(year, parameters, teamValues);
    statistics.totalGames += result.totalGames;
    statistics.correctPredictions += result.correctPredictions;
    statistics.losersWins += result.losersWins;
    statistics.totalLosersGames += result.totalLosersGames;

    if (result.totalGames > 0) {
      const seasonPercentage = Number(((result.correctPredictions / result.totalGames) * 100).toFixed(1));
      seasonsPercentages.push(seasonPercentage);
      updateProgress(year, seasonPercentage);
    }
  }

  return [statistics, seasonsPercentages];
};

const processSeason = async (
  year: number,
  parameters: Parameters,
  teamValues: Record<string, TeamValue[]>
): Promise<SeasonStatistics> => {
  // Simplified implementation for demo purposes
  // In a real application, you would fetch and process actual MLB data here
  const seasonStats: SeasonStatistics = {
    correctPredictions: Math.floor(Math.random() * 100),
    totalGames: 162,
    losersWins: Math.floor(Math.random() * 50),
    totalLosersGames: Math.floor(Math.random() * 100),
  };

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return seasonStats;
};

export const calculateResults = (seasonsPercentages: number[], statistics: SeasonStatistics): string => {
  const averagePercentage = seasonsPercentages.reduce((a, b) => a + b, 0) / seasonsPercentages.length;
  const deviationStandard = calculateStandardDeviation(seasonsPercentages);
  const significativo = esSignificativo(statistics.correctPredictions, statistics.totalGames);

  return `
Desviación estándar de los porcentajes: ${deviationStandard.toFixed(2)}%
Porcentaje + desviacion estandar: ${(((27 - deviationStandard) * 2 + averagePercentage) / 2).toFixed(2)}%
Es significativo: ${significativo}

Total de juegos: ${statistics.totalGames}
Aciertos: ${statistics.correctPredictions}
Porcentaje de aciertos: ${averagePercentage.toFixed(2)}%

Total de juegos de equipos <500: ${statistics.totalLosersGames}
Aciertos: ${statistics.losersWins}
Porcentaje de aciertos: ${((statistics.losersWins / statistics.totalLosersGames) * 100).toFixed(2)}%
  `;
};

const calculateStandardDeviation = (values: number[]): number => {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

const esSignificativo = (aciertos: number, total: number, nivelSignificancia: number = 0.05): boolean => {
  const pEsperado = 0.5;
  const z = (aciertos / total - pEsperado) / Math.sqrt((pEsperado * (1 - pEsperado)) / total);
  const valorP = 2 * (1 - normalCumulativeDistribution(Math.abs(z)));
  return valorP < nivelSignificancia;
};

const normalCumulativeDistribution = (z: number): number => {
  if (z < 0) return 1 - normalCumulativeDistribution(-z);
  const a = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
  const p = 0.2316419;
  const c = 0.39894228;
  const t = 1.0 / (1.0 + p * z);
  const b = c * Math.exp(-z * z / 2.0);
  let sum = 0;
  for (let i = 0; i < 5; i++) sum += a[i] * Math.pow(t, i + 1);
  return 1.0 - b * sum;
};