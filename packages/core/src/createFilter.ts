import { FilterOptions, TextGuardInstance } from "./types";
import { createEngine } from "./engine/createEngine";

export function createFilter(options: FilterOptions): TextGuardInstance {
  return createEngine(options);
}
