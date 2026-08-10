declare module "node:child_process" {
  export function execSync(
    command: string,
    options: { encoding: "utf-8" },
  ): string;
}

declare module "node:fs" {
  export function appendFileSync(path: string, data: string): void;
  export function existsSync(path: string): boolean;
  export function mkdirSync(
    path: string,
    options?: { recursive?: boolean },
  ): string | undefined;
  export function readFileSync(path: string, encoding: "utf-8"): string;
  export function writeFileSync(
    path: string,
    data: string,
    encoding?: "utf-8",
  ): void;
}

declare module "node:path" {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
}

declare const process: {
  readonly argv: string[];
  readonly env: Record<string, string | undefined>;
  cwd(): string;
  exit(code?: number): never;
};
