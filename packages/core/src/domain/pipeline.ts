import { Match } from "./match";

export interface PipelineContext {
  /**
   * متن اولیه که کاربر ارسال کرده است.
   * این مقدار هیچ‌وقت تغییر نمی‌کند.
   */
  readonly originalText: string;

  /**
   * متن فعلی که Stageها روی آن کار می‌کنند.
   */
  text: string;

  /**
   * Matchهای پیدا شده تا این لحظه.
   */
  matches: readonly Match[];
}
