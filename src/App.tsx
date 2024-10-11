import React, { useState } from 'react';
import { ChevronUp, Play } from 'lucide-react';
import { Parameters } from './types';
import { processSeasons, calculateResults } from './utils';

const App: React.FC = () => {
  const [parameters, setParameters] = useState<Parameters>({
    startYear: 1980,
    endYear: 2019,
    days: 20,
    daysInYear: 30,
    loser500: 40,
    differenceParameter: 30,
  });

  const [results, setResults] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParameters(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress({});
    setResults(null);
    setError(null);

    try {
      const [statistics, seasonsPercentages] = await processSeasons(parameters, (year, percentage) => {
        setProgress(prev => ({ ...prev, [year]: percentage }));
      });

      const resultsText = calculateResults(seasonsPercentages, statistics);
      setResults(resultsText);
    } catch (error) {
      console.error('Error processing seasons:', error);
      setError('An error occurred while processing the data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">MLB Rivalry Analysis</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(parameters).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={key}
                  type="number"
                  name={key}
                  value={value}
                  onChange={handleParameterChange}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <ChevronUp className="animate-bounce mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {Object.keys(progress).length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Progress</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(progress).map(([year, percentage]) => (
                <div key={year} className="text-center">
                  <div className="font-bold">{year}</div>
                  <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-xl font-bold mb-4">Results</h2>
            <div className="space-y-4">
              {results.split('\n\n').map((section, index) => (
                <div key={index} className="border-b pb-4">
                  {section.split('\n').map((line, lineIndex) => {
                    const [label, value] = line.split(':');
                    return (
                      <div key={lineIndex} className="flex justify-between">
                        <span className="font-semibold">{label}:</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;