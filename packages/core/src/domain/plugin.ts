export interface Plugin {
  readonly name: string;

  setup(): void;
}
