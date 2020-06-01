declare namespace NodeJS {
  export interface Global {
    storage: any;
    cloudEnv: {
      getString(key: string):string;
      getDictionary(key: string):Record<string, string>;
    };
  }
}
