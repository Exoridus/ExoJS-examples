import { DirectoryMapping, IExampleCategory } from "./types";

let currentId = 1;

export const getUniqueId = (): number => currentId++;

export const getCleanTitle = (text: string): string => text.split('-')
  .map((part: string) => part[0].toUpperCase() + part.substr(1))
  .join(' ');

const mapExample = (path: string, fileName: string) => ({
  id: getUniqueId(),
  title: getCleanTitle(fileName),
  path: `${path}/${fileName}.js`,
});

const mapExamples = (path: string, files: Array<string>) => files.map(fileName => mapExample(path, fileName));

const mapCategory = (path: string, files: Array<string>) => ({
  id: getUniqueId(),
  title: getCleanTitle(path),
  examples: mapExamples(path, files),
});

export const buildExamples = (config: DirectoryMapping): Array<IExampleCategory> => Object.keys(config).map(key => mapCategory(key, config[key]));
