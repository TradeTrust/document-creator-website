import debug from "debug";

// not using .extends because of stupid next.js resolve modules bug where its picking up old version of debug
export const trace = (namespace: string): debug.Debugger => debug(`creator:trace:${namespace}`);
export const error = (namespace: string): debug.Debugger => debug(`creator:error:${namespace}`);
export const stack = (namespace: string) => (error: Error): void => {
  debug(`creator:error:${namespace}`)(error.message);
  debug(`creator:error:${namespace}`)(error.stack);
};

export const getLogger = (
  namespace: string
): { trace: debug.Debugger; error: debug.Debugger; stack: (error: Error) => void } => ({
  trace: trace(namespace),
  error: error(namespace),
  stack: stack(namespace),
});
