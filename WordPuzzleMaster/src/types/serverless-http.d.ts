declare module 'serverless-http' {
  import { Express } from 'express';
  
  interface ServerlessOptions {
    binary?: boolean | string[];
    provider?: string;
    request?: any;
    response?: any;
  }
  
  function serverless(
    app: Express | any,
    options?: ServerlessOptions
  ): (event: any, context: any) => Promise<any>;
  
  export default serverless;
}