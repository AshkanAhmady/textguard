export interface Normalizer {
  readonly id: string;
  readonly name: string;

  normalize(text: string): string;
}
