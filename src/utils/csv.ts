import { Word } from '../types';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote ("") inside quoted value
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Don't forget the last field
  result.push(current.trim());

  return result;
}

export function parseCSV(csv: string): Word[] {
  const lines = csv.trim().split('\n');
  const words: Word[] = [];

  // Skip header row (first line)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Sheet format: Column 1 = Swedish, Column 2 = English
    const fields = parseCSVLine(line);

    if (fields.length >= 2 && fields[0] && fields[1]) {
      words.push({
        swedish: fields[0],
        english: fields[1],
      });
    }
  }

  return words;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
