import { DirectoryMapping, IConfig, IExampleCategory } from "../types";
import { buildExamples } from "../utils";

interface ConfigOptions extends Omit<IConfig, "examples"> {
  examples: DirectoryMapping;
}

export class Config implements IConfig {
  public readonly examplesPath: string;
  public readonly assetsPath: string;
  public readonly examples: Array<IExampleCategory>;
  public readonly requestOptions: RequestInit;

  public constructor({ examplesPath, assetsPath, examples, requestOptions }: ConfigOptions) {

    this.examplesPath = examplesPath ?? 'examples';
    this.assetsPath= assetsPath ?? 'assets';
    this.examples= buildExamples(examples ?? {});
    this.requestOptions = requestOptions ?? {
      cache: "no-cache",
      method: "GET",
      mode: "cors"
    };
  }
}
