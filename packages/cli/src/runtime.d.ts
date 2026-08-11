declare const process: {
  argv: string[];
  exitCode?: number;
  stdin: {
    setEncoding(encoding: "utf8"): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
    on(event: "error", listener: (error: unknown) => void): void;
  };
};
