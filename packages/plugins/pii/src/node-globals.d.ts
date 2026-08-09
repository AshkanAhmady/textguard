declare module "node:child_process" {
  export function execSync(
    command: string,
    options: { encoding: "utf-8" },
  ): string;
}

declare module "node:fs" {
  export function appendFileSync(path: string, data: string): void;
}

declare const process: {
  readonly argv: string[];
  readonly env: Record<string, string | undefined>;
  exit(code?: number): never;
};
