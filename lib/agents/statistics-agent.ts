import { geminiClient } from '../gemini-client';

export interface StatisticData {
    category: string;
    label: string;
    value: number;
    unit?: string;
    context: string;
}

export class StatisticsAgent {
    async process(text: string): Promise<StatisticData[]> {
        const prompt = `
      Analyze the following research document text and extract key statistical data points, quantitative claims, and performance metrics.
      Focus on concrete numbers, percentages, and measured results.
      
      For each finding, provide:
      1. Category: (e.g., Performance, Demographics, Financial, Efficiency, Accuracy, Other)
      2. Label: A short descriptive label for the metric (e.g., "Accuracy", "Latency", "Sample Size")
      3. Value: The numerical value (extract the number)
      4. Unit: The unit of measurement (e.g., "%", "ms", "users", "USD") - optional if unitless
      5. Context: The sentence or phrase where this statistic appears.

      Return the result as a JSON object with a "statistics" key containing an array of objects.
      Limit to the top 15 most significant statistics.
      
      Text to analyze:
      ${text.substring(0, 20000)}
    `;

        try {
            const result = await geminiClient.generateJSON<{ statistics: StatisticData[] }>(prompt);
            return result.statistics || [];
        } catch (error) {
            console.error('Statistics Agent Error:', error);
            return [];
        }
    }
}

export const statisticsAgent = new StatisticsAgent();
