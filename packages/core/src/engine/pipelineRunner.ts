// import type { Normalizer } from "../domain/normalizer";
// import type { Rule } from "../domain/rule";
// import type { PipelineContext } from "../domain/pipeline";

// export interface PipelineRunnerOptions {
//   normalizers: readonly Normalizer[];
//   rules: readonly Rule[];
// }

// export function runPipeline(
//   context: PipelineContext,
//   options: PipelineRunnerOptions,
// ): PipelineContext {
//   let current = context;

//   // اجرای Normalizerها
//   for (const normalizer of options.normalizers) {
//     current = normalizer.normalize(current);
//   }

//   // اجرای Ruleها
//   for (const rule of options.rules) {
//     current.matches.push(...rule.match(current));
//   }

//   return current;
// }
