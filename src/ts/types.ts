export interface IExample {
  id: number;
  title: string;
  path: string;
}

export interface IExampleCategory {
  id: number;
  title: string;
  examples: Array<IExample>;
}

export interface IConfig {
  examplesPath: string,
  assetsPath: string,
  examples: Array<IExampleCategory>,
  requestOptions: RequestInit;
}

export interface DirectoryMapping {
  [directoryPath: string]: Array<string>,
}

export interface ILoadExamplesEvent {
  example: IExample | null;
}
