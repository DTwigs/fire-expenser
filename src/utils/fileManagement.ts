import Papa from "papaparse";
import type { FileDatumContent } from "../store/types";

type parseCSVProps = {
  file: Papa.LocalFile;
  onComplete: (results: FileDatumContent) => void;
  onError: (error: Papa.ParseError) => void;
};

// Parse CSV string
export const parseCSV = ({ file, onComplete, onError }: parseCSVProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Papa as any).parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<string[]>) =>
      onComplete(transformFileData(results)),
    error: onError,
  });
};

const transformFileData = (
  results: Papa.ParseResult<string[]>
): FileDatumContent => {
  const hasHeaders = checkForHeaders(results);
  const content: FileDatumContent = { headers: [], data: [] };

  if (hasHeaders) {
    content.headers = results.data[0]; // first row are headers
  } else {
    content.headers = results.data[0].map((_, index) => index.toString());
  }

  content.data = results.data.slice(1).map((dataRow: string[]) => {
    return dataRow.reduce((acc: { [key: string]: string }, field, index) => {
      acc[content.headers[index]] = field;
      return acc;
    }, {});
  });

  return content;
};

const checkForHeaders = (results: Papa.ParseResult<string[]>): boolean => {
  const firstRow = results.data[0];
  const secondRow = results.data[1];

  // Check if first row contains typical header patterns
  const headerIndicators = [
    // Contains common header words
    firstRow.some((cell) =>
      /^(description|category|expense|card|amount|date|name|id|total|price|quantity)$/i.test(
        cell.trim()
      )
    ),

    // All cells are text (not numeric)
    firstRow.every((cell) => !/^\d+(\.\d+)?$/.test(cell.trim())),

    // Second row contains numeric values (like "124.44", "58.62")
    secondRow.some((cell) => /^\d+(\.\d+)?$/.test(cell.trim())),

    // First row has mixed case (typical for headers)
    firstRow.some((cell) => /[a-z]/.test(cell) && /[A-Z]/.test(cell)),

    // First row doesn't contain date patterns
    !firstRow.some((cell) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cell.trim())),
  ];

  // If majority of indicators suggest headers, return true
  return headerIndicators.filter(Boolean).length >= 3;
};
