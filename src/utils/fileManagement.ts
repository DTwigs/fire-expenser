import Papa from "papaparse";
import type { FileDataItem } from "../store/types";

type parseCSVProps = {
  file: Papa.LocalFile;
  onComplete: (results: Papa.ParseResult<FileDataItem>) => void;
  onError: (error: Papa.ParseError) => void;
};

// Parse CSV string
export const parseCSV = ({ file, onComplete, onError }: parseCSVProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Papa as any).parse(file, {
    header: true, // Treats first row as headers
    skipEmptyLines: true,
    complete: onComplete,
    error: onError,
  });
};
