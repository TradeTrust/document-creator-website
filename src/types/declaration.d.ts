declare module "tailwindcss/resolveConfig";

// Fix wrong typing for web3-providers-http package
declare module "web3-providers-http" {
  class HttpProvider extends HttpProviderBase {
    host: string;

    withCredentials: boolean;
    timeout: number;
    headers?: HttpHeader[];
    agent?: HttpProviderAgent;
    connected: boolean;

    constructor(host?: string, options?: HttpProviderOptions);

    send(
      // eslint-disable-next-line @typescript-eslint/ban-types
      payload: object,
      callback?: (error: Error | null, result: JsonRpcResponse | undefined) => void
    ): void;
    disconnect(): boolean;
    supportsSubscriptions(): boolean;
  }

  // eslint-disable-next-line import/no-default-export
  export default HttpProvider;
}
