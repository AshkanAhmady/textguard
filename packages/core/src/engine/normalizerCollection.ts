import type { Normalizer } from "../domain/normalizer";

export class NormalizerCollection {
  private readonly normalizers: Normalizer[] = [];

  constructor(normalizers: readonly Normalizer[] = []) {
    this.normalizers.push(...normalizers);
  }

  add(normalizer: Normalizer): void {
    this.normalizers.push(normalizer);
  }

  getAll(): readonly Normalizer[] {
    return this.normalizers;
  }
}
